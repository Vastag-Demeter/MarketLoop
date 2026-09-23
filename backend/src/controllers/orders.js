import prisma from "../constants/db.js";
import { generateOrderNumber } from "../functions/functions.js";
import { sendEmail } from "../utils/email.js";
import { EMAIL_TYPES } from "../constants/emailTypes.js";
import {
  orderConfirmationTemplate,
  statusUpdateTemplate,
} from "../templates/emailTemplates.js";
import { logger } from "../utils/logger.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.orders.findMany({
      include: {
        items: true,
        user: true,
        paymentMethod: true,
        status: true,
      },
    });

    return res.status(200).json({ data: orders });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getOrderById = async (req, res) => {
  const id = parseInt(req.params.id);

  if (!Number.isInteger(id))
    return res
      .status(400)
      .json({ error: "ID is required and must be an integer." });

  try {
    const order = await prisma.orders.findFirst({
      where: {
        id: id,
      },
      include: {
        items: true,
        user: true,
        paymentMethod: true,
        status: true,
      },
    });

    if (!order) return res.status(404).json({ error: "Order not found." });

    return res.status(200).json({ data: order });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addOrder = async (req, res) => {
  const user = req.user;
  const {
    shipping_cost,
    payment_method_id,
    billing_address,
    shipping_address,
    cart_id,
    customer_email,
    customer_name,
    customer_phone,
  } = req.body;

  try {
    const orderNumber = generateOrderNumber();

    const status = await prisma.orderStatuses.findFirst({
      where: { name: "PENDING" },
    });

    const cart = await prisma.carts.findUnique({
      where: { id: cart_id },
      include: {
        cartItems: {
          include: {
            variant: { include: { product: true } },
          },
        },
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty or not found." });
    }

    const itemsTotal = cart.cartItems.reduce((sum, item) => {
      const unitPrice =
        item.variant.product.base_price + item.variant.price_modifier;
      return sum + unitPrice * item.quantity;
    }, 0);

    let createdOrder;
    let cancelToken;
    await prisma.$transaction(async (tx) => {
      createdOrder = await tx.orders.create({
        data: {
          user_id: user?.user_id || null,
          customer_email: customer_email,
          customer_name: customer_name,
          customer_phone: customer_phone,
          order_number: orderNumber,
          status_id: status.id,
          total_amount: itemsTotal + shipping_cost,
          shipping_cost: shipping_cost,
          payment_method_id: payment_method_id,
          billing_address: billing_address,
          shipping_address: shipping_address,
          items: {
            create: cart.cartItems.map((item) => ({
              variant_id: item.variant_id,
              variant_sku: item.variant.variant_sku,
              name: item.variant.product.name,
              unit_price:
                item.variant.product.base_price + item.variant.price_modifier,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });
      cancelToken = createdOrder.cancel_token;
      await Promise.all(
        cart.cartItems.map((item) => {
          return tx.productVariants.update({
            where: { id: item.variant_id },
            data: { stock: { decrement: item.quantity } },
          });
        }),
      );

      await tx.cartItems.deleteMany({ where: { cart_id: cart_id } });
    });

    const recipientEmail = user?.email || customer_email;

    try {
      const cancelUrl = `${process.env.FRONTED_API_URL}/cancel-order?number=${createdOrder.order_number}&token=${cancelToken}`;
      const emailSubject = `[LOOP_MARKET] Transmission Received: ${createdOrder.order_number}`;
      const emailBody = orderConfirmationTemplate(createdOrder, cancelUrl);

      await sendEmail({
        email: recipientEmail,
        subject: emailSubject,
        message: emailBody,
      });
      await prisma.emailLogs.create({
        data: {
          recipient_email: recipientEmail,
          user_id: user?.user_id ? user.user_id : null,
          type_id: EMAIL_TYPES["ORDER_CONFIRMATION"],
          subject: emailSubject,
          body: emailBody,
          sent_at: new Date(),
        },
      });
    } catch (error) {
      logger.error("Email delivery or logging failed:", error);
    }
    return res.status(201).json({
      msg: "Items ordered successfully.",
      order_number: createdOrder.order_number,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const changeOrderStatus = async (req, res) => {
  const { id, status_id } = req.body;

  try {
    const status = await prisma.orderStatuses.findUnique({
      where: { id: status_id },
    });

    if (!status) return res.status(404).json({ error: "Status not found." });

    const order = await prisma.orders.update({
      where: { id: id },
      data: { status_id: status_id },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!order) return res.status(404).json({ error: "Order not found." });

    const recipientEmail =
      order.user_id === null ? order.customer_email : order.user.email;
    if (recipientEmail) {
      try {
        const subject = `[UPDATE] Phase Change: ${order.order_number}`;
        const message = statusUpdateTemplate(
          order.order_number,
          status.name,
          "Your order reached a new stage.",
        );
        await sendEmail({
          email: recipientEmail,
          subject: subject,
          message: message,
        });

        await prisma.emailLogs.create({
          data: {
            recipient_email: recipientEmail,
            user_id: order.user_id === null ? null : order.user_id,
            type_id: EMAIL_TYPES["ORDER_STATUS_UPDATE"],
            subject: subject,
            body: message,
          },
        });
      } catch (e) {
        logger.error("Email error:", e);
      }
    }

    return res.status(201).json({ msg: "Status changed successfully." });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const cancelOrder = async (req, res) => {
  const { token, number } = req.params;
  try {
    const order = await prisma.orders.findFirst({
      where: { cancel_token: token, order_number: number },
      include: { status: true, user: true },
    });

    if (!order)
      return res.status(404).json({ msg: "Invalid cancelling token." });

    const restrictedStatuses = ["SHIPPED", "DELIVERED", "CANCELLED"];
    if (restrictedStatuses.includes(order.status.name)) {
      return res.status(400).json({
        error:
          "Cannot cancel order (already shipped, delivered or cancelled ).",
      });
    }

    const orderWithItems = await prisma.orders.update({
      where: { id: order.id },
      data: {
        status: { connect: { name: "CANCELLED" } },
      },
      include: { items: true },
    });

    await prisma.$transaction(
      orderWithItems.items.map((item) =>
        prisma.productVariants.update({
          where: { id: item.variant_id },
          data: { stock: { increment: item.quantity } },
        }),
      ),
    );
    try {
      const subject = `[TERMINATED] Order Cancelled: ${order.status.name}`;
      const message = statusUpdateTemplate(
        order.order_number,
        "CANCELLED",
        "Your order was cancelled successfully. Every item got back to our storage.",
      );
      await sendEmail({
        email: order.customer_email,
        subject: subject,
        message: message,
      });
      await prisma.emailLogs.create({
        data: {
          recipient_email: order.customer_email,
          user_id: order.user_id === null ? null : order.user_id,
          subject: subject,
          type_id: EMAIL_TYPES["ORDER_STATUS_UPDATE"],
          body: message,
        },
      });
    } catch (e) {
      logger.error("Email error:", e);
    }

    return res.status(200).json({ msg: "Order cancelled successfully." });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyOrders = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const orders = await prisma.orders.findMany({
      where: { user_id: userId },
      include: {
        status: true,
        items: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return res.status(200).json({ data: orders });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getOrderByNumber = async (req, res) => {
  const { order_number } = req.params;

  try {
    const order = await prisma.orders.findUnique({
      where: { order_number: order_number },
      include: {
        status: { select: { name: true, is_final: true } },
        items: true,
      },
    });

    if (!order) return res.status(404).json({ error: "Order not found." });

    if (order.user_id && order.user_id !== req.user?.user_id)
      return res
        .status(403)
        .json({ error: "Unauthorized access to this order." });

    return res.status(200).json({ data: order });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
