import prisma from "../constants/db.js";
import { sendEmail } from "../utils/email.js";
import {
  getSupportTicketByIdSchema,
  getSupportTicketByTokenSchema,
} from "../validators/support.validator.js";
import techEmailTemplate from "../templates/replyToTicketTemplate.js";
import { STATUSES } from "../constants/ticketStatuses.js";
import ticketCreatedTemplate from "../templates/ticketCreated.js";
import ticketStatusUpdateTemplate from "../templates/ticketStatusUpdateTemplate.js";

export const createSupportTicket = async (req, res) => {
  const { subject, message, guest_email } = req.body;
  const user = req.user;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const ticket = await tx.supportTickets.create({
        data: {
          user_id: user ? user.user_id : null,
          guest_email: user ? user.email : guest_email,
          subject: subject,
          status_id: 1,
          last_reply_at: new Date(),
        },
      });

      await tx.ticketMessages.create({
        data: {
          ticket_id: ticket.id,
          user_id: user ? user.user_id : null,
          agent_user_id: null,
          message: message,
        },
      });

      await tx.emailLogs.create({
        data: {
          recipient_email: user ? user.email : guest_email,
          user_id: user ? user.user_id : null,
          type_id: STATUSES["WAITING_FOR_AGENT"],
          subject: `Ticket Created: ${subject}`,
          body: message,
        },
      });

      return ticket;
    });
    console.log(result);
    const url = `${process.env.FRONTED_API_URL}/support/ticket/${result.access_token}`;
    await sendEmail({
      from: `WebShop Helpdesk <helpdesk.webshop@webshop.hu>`,
      email: result.guest_email,
      subject: result.subject,
      message: ticketCreatedTemplate(result.subject, result.message, url),
    });

    return res
      .status(201)
      .json({ msg: "Ticket opened successfully.", data: result });
  } catch (error) {
    console.error("Support Ticket Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const replyToTicket = async (req, res) => {
  const { ticket_id, message } = req.body;
  const agent = req.user;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const ticket = await tx.supportTickets.findUnique({
        where: { id: ticket_id },
        include: { user: true },
      });
      if (!ticket) return res.status(404).json({ error: "Ticket not found." });

      await tx.ticketMessages.create({
        data: {
          ticket_id: ticket_id,
          user_id: ticket.user_id,
          agent_user_id: agent.user_id,
          message: message,
        },
      });

      await tx.supportTickets.update({
        where: { id: ticket_id },
        data: {
          status_id: STATUSES["WAITING_FOR_CUSTOMER"],
          last_reply_at: new Date(),
        },
      });

      await tx.emailLogs.create({
        data: {
          recipient_email: ticket.user_id
            ? ticket.user.email
            : ticket.guest_email,
          user_id: ticket.user_id,
          type_id: 2,
          subject: `Re: ${ticket.subject}`,
          body: message,
          sent_at: new Date(),
        },
      });
      return {
        email: ticket.user ? ticket.user.email : ticket.guest_email,
        subject: `Re: ${ticket.subject}`,
        message: message,
        ticket_id: ticket.id,
        access_token: ticket.access_token,
      };
    });

    const url = `${process.env.FRONTED_API_URL}/support/ticket/${result.access_token}`;
    await sendEmail({
      from: `WebShop Helpdesk <helpdesk.webshop@webshop.hu>`,
      email: result.email,
      subject: result.subject,
      message: techEmailTemplate(result.subject, result.message, url),
    });

    return res.status(200).json({ msg: "Response sent and email dispatched." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getSupportTickets = async (req, res) => {
  try {
    const tickets = await prisma.supportTickets.findMany({
      include: {
        ticketStatus: true,
        ticketMessages: {
          include: {
            user: true,
            agent: true,
          },
        },
      },
    });

    return res.status(200).json({ data: tickets });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getSupportTicketById = async (req, res) => {
  const { id } = req.params;

  const { error } = getSupportTicketByIdSchema.validate({ id });
  if (error) return res.status(400).json({ error: error.details.messages[0] });

  try {
    const ticket = await prisma.supportTickets.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        ticketStatus: true,
        ticketMessages: {
          include: {
            user: true,
            agent: true,
          },
        },
      },
    });
    if (!ticket) return res.status(404).json({ error: "Ticket not found." });
    return res.status(200).json({ data: ticket });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getSupportTicketByToken = async (req, res) => {
  const { token } = req.params;
  const { error } = getSupportTicketByTokenSchema.validate({ token });
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const ticket = await prisma.supportTickets.findUnique({
      where: {
        access_token: token,
      },
      include: {
        ticketStatus: true,
        ticketMessages: {
          include: {
            user: true,
            agent: true,
          },
        },
      },
    });
    if (!ticket) return res.status(404).json({ error: "Ticket not found." });
    return res.status(200).json({ data: ticket });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const replyToTicketByCustomer = async (req, res) => {
  const { token, message } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const ticket = await tx.supportTickets.findUnique({
        where: {
          access_token: token,
        },
      });
      if (!ticket) return res.status(404).json({ error: "Ticket not found." });

      const newMessage = await tx.ticketMessages.create({
        data: {
          ticket_id: ticket.id,
          user_id: ticket.user_id ? ticket.user_id : null,
          agent_user_id: null,
          message: message,
        },
      });

      await tx.supportTickets.update({
        where: { id: ticket.id },
        data: {
          last_reply_at: new Date(),
          status_id: STATUSES["WAITING_FOR_AGENT"],
        },
      });

      return newMessage;
    });
    return res
      .status(201)
      .json({ msg: "Response sent successfully.", data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const toggleTicketStatus = async (req, res) => {
  const { id } = req.body;
  console.log("ID: ", id);
  try {
    const result = await prisma.$transaction(async (tx) => {
      const ticket = await tx.supportTickets.findUnique({
        where: {
          id: id,
        },
        include: {
          ticketStatus: true,
        },
      });
      if (!ticket) return res.status(404).json({ error: "Ticket not found." });
      console.log("OPEN: ", STATUSES["OPEN"]);
      console.log("CLOSED: ", STATUSES["CLOSED"]);
      const status_id =
        ticket.ticketStatus.id === STATUSES["OPEN"]
          ? STATUSES["CLOSED"]
          : STATUSES["OPEN"];
      const updatedTicket = await tx.supportTickets.update({
        where: {
          id: id,
        },
        data: {
          status_id: status_id,
        },
        include: {
          ticketStatus: true,
        },
      });

      return {
        old: ticket,
        new: updatedTicket,
      };
    });
    const url = `${process.env.FRONTEND_API_URL}/support/ticket/${result.new.access_token}`;
    await sendEmail({
      from: `WebShop Helpdesk <helpdesk.webshop@webshop.hu>`,
      email: result.new.guest_email,
      subject: "TICKET STATUS CHANGE",
      message: ticketStatusUpdateTemplate(
        "TICKET STATUS CHANGE",
        result.old.ticketStatus.name,
        result.new.ticketStatus.name,
        url,
      ),
    });

    return res
      .status(201)
      .json({ msg: "Status toggled successfully.", data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
