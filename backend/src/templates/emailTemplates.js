export const orderConfirmationTemplate = (order, cancelUrl) => {
  const shipping = order.shipping_address;
  const terminalId = Math.random().toString(36).substr(2, 9).toUpperCase();

  const generateProductRows = (items) => {
    return items
      .map((item) => {
        const name = item.product_name || item.name || "Unknown Unit";

        const price = item.price || item.unit_price || 0;
        const total = price * item.quantity;

        return `
          <div style="padding: 15px; border: 1px solid rgba(8, 145, 178, 0.2); background-color: rgba(2, 6, 23, 0.5); border-radius: 12px; margin-bottom: 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="left">
                  <div style="color: #06b6d4; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">[ UNIT_TYPE ]</div>
                  <div style="color: #ffffff; font-size: 14px; font-weight: bold; font-family: 'Courier New', Courier, monospace;">
                    ${item.quantity}x ${name}
                  </div>
                  ${item.variant_sku ? `<div style="color: #475569; font-size: 10px; margin-top: 4px;">SKU: ${item.variant_sku}</div>` : ""}
                </td>
                <td align="right" valign="top">
                  <div style="color: #ffffff; font-size: 14px; font-weight: bold; font-family: 'Courier New', Courier, monospace;">
                    $${total.toLocaleString()}
                  </div>
                </td>
              </tr>
            </table>
          </div>
        `;
      })
      .join("");
  };

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - MARKET_LOOP</title>
</head>
<body style="margin: 0; padding: 0; background-color: #020617; font-family: 'Courier New', Courier, monospace; color: #cbd5e1;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #020617;">
        <tr>
            <td align="center" style="padding: 40px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0f172a; border: 1px solid #0891b2; border-radius: 24px; overflow: hidden; border-collapse: separate;">
                    
                    <tr>
                        <td align="left" style="padding: 40px 40px 20px 40px; background-color: #0f172a;">
                            <div style="text-transform: uppercase; letter-spacing: 0.3em; font-size: 10px; font-weight: 900; color: #0891b2; margin-bottom: 8px;">
                                MARKET_LOOP // SHIPMENT_CONFIRMATION
                            </div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 900; font-style: italic; text-transform: uppercase; letter-spacing: -0.05em;">
                                #${order.order_number}
                            </h1>
                            <div style="font-size: 10px; color: #475569; margin-top: 10px;">
                                TIMESTAMP: ${new Date().toISOString()}
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td align="left" style="padding: 20px 40px 40px 40px;">
                            <div style="border-left: 3px solid #06b6d4; padding-left: 20px; margin-bottom: 30px;">
                                <p style="margin: 0; font-size: 18px; color: #ffffff; font-weight: bold;">
                                    Greetings, ${order.customer_name || "Authorized_User"}!
                                </p>
                            </div>
                            
                            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
                                Data transfer successful. Selected hardware components are now being prepared for deployment to your designated sector.
                            </p>
                            
                            <div style="background-color: #020617; border: 1px solid #1e293b; border-radius: 16px; padding: 25px; margin: 25px 0;">
                                <div style="color: #06b6d4; font-size: 11px; font-weight: 900; letter-spacing: 0.1em; margin-bottom: 10px;">
                                    [ TARGET_COORDINATES ]
                                </div>
                                <div style="color: #ffffff; font-size: 15px; font-weight: bold; line-height: 1.5;">
                                    ${shipping.postal_code} ${shipping.city}<br>
                                    ${shipping.street} ${shipping.house_number}<br>
                                    <span style="color: #475569; font-size: 12px; font-weight: normal;">
                                        ${shipping.floor ? `LEVEL: ${shipping.floor} ` : ""} ${shipping.door ? `PORT: ${shipping.door}` : ""}
                                    </span>
                                </div>
                            </div>

                            <div style="font-size: 12px; color: #06b6d4; margin-bottom: 15px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;">
                                &gt; Cargo_Manifest
                            </div>
                            
                            <div style="margin-bottom: 30px;">
                                ${generateProductRows(order.items)}
                            </div>

                            <div style="background-color: #020617; padding: 25px; border-radius: 16px; border: 1px solid #0891b2; text-align: right;">
                                <div style="color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 900;">Logistics_Fee: $${order.shipping_cost.toLocaleString()}</div>
                                <div style="color: #06b6d4; font-size: 32px; font-weight: 900; margin-top: 5px;">$${order.total_amount.toLocaleString()}</div>
                            </div>

                            <div style="margin-top: 40px; padding: 30px; border: 1px dashed #ef4444; border-radius: 16px; background-color: rgba(239, 68, 68, 0.03); text-align: center;">
                                <div style="color: #ef4444; font-size: 10px; font-weight: 900; letter-spacing: 0.2em; margin-bottom: 10px;">[ DANGER_ZONE ]</div>
                                <p style="color: #94a3b8; font-size: 12px; margin-bottom: 20px;">If you wish to terminate the delivery protocol, execute the command below:</p>
                                <a href="${cancelUrl}" style="display: inline-block; padding: 14px 28px; background-color: #ef4444; color: #ffffff !important; text-decoration: none; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; border-radius: 8px;">
                                    Abort_Sequence
                                </a>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding: 30px 40px; background-color: #020617; border-top: 1px solid #1e293b;">
                            <div style="font-size: 10px; color: #475569; letter-spacing: 0.1em; line-height: 1.8;">
                                TERMINAL: ${terminalId} // LOCATION: SECTOR_7-G<br>
                                <span style="color: #1e293b;">© 2026 NEO-SHOP SYSTEMS. ALL RIGHTS RESERVED.</span>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
};
export const statusUpdateTemplate = (orderNumber, statusName, message = "") => {
  const authSignature = Math.random().toString(36).substr(5, 12).toUpperCase();

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #020617; font-family: 'Courier New', Courier, monospace; color: #cbd5e1;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #020617;">
        <tr>
            <td align="center" style="padding: 40px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0f172a; border: 1px solid #0891b2; border-radius: 24px; overflow: hidden; border-collapse: separate;">
                    
                    <tr>
                        <td align="left" style="padding: 40px 40px 20px 40px; background-color: #0f172a;">
                            <div style="text-transform: uppercase; letter-spacing: 0.3em; font-size: 10px; font-weight: 900; color: #0891b2; margin-bottom: 8px;">
                                [ LOGISTICS_UPDATE_V2.4 ]
                            </div>
                            <div style="font-size: 11px; color: #475569; margin-bottom: 5px; font-family: monospace;">
                                REF_ID: ${orderNumber}
                            </div>
                            <h2 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 900; font-style: italic; text-transform: uppercase; letter-spacing: -0.05em;">
                                Status_Change: <span style="color: #06b6d4;">Detected</span>
                            </h2>
                        </td>
                    </tr>

                    <tr>
                        <td align="left" style="padding: 20px 40px 10px 40px;">
                            <div style="background-color: rgba(6, 182, 212, 0.05); border: 1px dashed #0891b2; border-radius: 16px; padding: 30px; text-align: center;">
                                <div style="color: #06b6d4; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 10px;">
                                    New_Phase_Activated
                                </div>
                                <div style="font-size: 28px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">
                                    ${statusName.toUpperCase()}
                                </div>
                            </div>
                        </td>
                    </tr>

                    ${
                      message
                        ? `
                    <tr>
                        <td align="left" style="padding: 20px 40px 10px 40px;">
                            <div style="color: #94a3b8; font-size: 13px; border-left: 2px solid #06b6d4; padding: 10px 0 10px 20px; font-style: italic; line-height: 1.6;">
                                "Broadcast_Message: ${message}"
                            </div>
                        </td>
                    </tr>
                    `
                        : ""
                    }

                    <tr>
                        <td align="left" style="padding: 20px 40px 40px 40px;">
                            <p style="color: #475569; font-size: 12px; line-height: 1.5; margin: 0;">
                                Your shipment protocol has advanced to the next stage. No further action is required at this time. Monitor your terminal for real-time tracking updates.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding: 30px 40px; background-color: #020617; border-top: 1px solid #1e293b;">
                            <div style="font-size: 10px; color: #1e293b; letter-spacing: 0.1em; margin-bottom: 5px;">
                                NEO-SHOP CORE // AUTH_SIG: ${authSignature}
                            </div>
                            <div style="font-size: 9px; color: #334155; text-transform: uppercase; letter-spacing: 0.3em;">
                                System_Status: Nominal
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
};
