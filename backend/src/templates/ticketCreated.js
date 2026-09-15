const ticketCreatedTemplate = (subject, ticketId, accessUrl) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { background-color: #020203; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
        .wrapper { background-color: #020203; padding: 40px 10px; }
        .container { 
            max-width: 600px; margin: 0 auto; background-color: #0a0a0c;
            border: 1px solid #1e293b; border-radius: 24px; overflow: hidden;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }
        .header { 
            padding: 30px; background: linear-gradient(to bottom, #0f172a, #0a0a0c);
            text-align: center; border-bottom: 1px solid #1e293b;
        }
        .header h1 { margin: 0; color: #ffffff; font-size: 20px; text-transform: uppercase; letter-spacing: 4px; font-weight: 900; }
        .header h1 span { color: #06b6d4; }
        
        .content { padding: 40px 30px; color: #94a3b8; line-height: 1.6; }
        .status-badge {
            display: inline-block; padding: 4px 12px; background: rgba(6, 182, 212, 0.1);
            color: #06b6d4; border: 1px solid #06b6d4; border-radius: 8px;
            font-size: 10px; font-weight: bold; margin-bottom: 20px; text-transform: uppercase;
        }
        .subject-text { color: #ffffff; font-size: 22px; font-weight: bold; margin-bottom: 10px; }
        .ticket-id { color: #475569; font-size: 13px; font-family: monospace; margin-bottom: 25px; }
        
        .info-box { 
            background: #020203; border: 1px solid #1e293b; border-radius: 16px;
            padding: 20px; margin: 25px 0; color: #cbd5e1; font-size: 14px;
        }
        
        .action-area { text-align: center; padding: 20px 0; }
        .btn { 
            display: inline-block; background-color: #0891b2; color: #020203 !important; 
            padding: 18px 35px; border-radius: 14px; text-decoration: none; 
            font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;
        }
        
        .footer { padding: 30px; background-color: #050507; font-size: 10px; text-align: center; color: #475569; letter-spacing: 1px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <h1>MARKET_LOOP_<span>SYSTEMS</span></h1>
            </div>

            <div class="content">
                <div class="status-badge">New_Inquiry_Registered</div>
                <div class="subject-text">${subject}</div>
                <div class="ticket-id">LOG_HASH: #${ticketId}</div>
                
                <p>Greetings Citizen,</p>
                <p>Your support request has been successfully uploaded to our secure servers. A technician will review the data and establish a connection shortly.</p>
                
                <div class="info-box">
                    <strong>ESTIMATED_RESPONSE_TIME:</strong> 24-48 HOURS<br>
                    <strong>ENCRYPTION_STATUS:</strong> ACTIVE<br>
                    <strong>PROTOCOL:</strong> SUPPORT_V4
                </div>

                <p>You can track the real-time status of your inquiry and add additional comments through your unique access node:</p>

                <div class="action-area">
                    <a href="${accessUrl}" class="btn">Monitor_Ticket_Status</a>
                </div>
            </div>

            <div class="footer">
                &copy; 2026 MARKET_LOOP_COMMERCE_PROTOCOL // TERMINAL_ID: 0x${Math.floor(
                  Math.random() * 16777215,
                )
                  .toString(16)
                  .toUpperCase()} <br>
                SECURE_CONNECTION_CONFIRMED
            </div>
        </div>
    </div>
</body>
</html>
`;

export default ticketCreatedTemplate;
