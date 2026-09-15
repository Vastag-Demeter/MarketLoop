export const ticketStatusUpdateTemplate = (
  subject,
  oldStatus,
  newStatus,
  accessUrl,
) => `
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
            box-shadow: 0 0 40px rgba(6, 182, 212, 0.1);
        }
        .header { 
            padding: 30px; background: linear-gradient(to bottom, #0f172a, #0a0a0c);
            text-align: center; border-bottom: 1px solid #1e293b;
        }
        .header h1 { margin: 0; color: #ffffff; font-size: 20px; text-transform: uppercase; letter-spacing: 4px; font-weight: 900; }
        .header h1 span { color: #06b6d4; }
        
        .content { padding: 40px 30px; color: #94a3b8; line-height: 1.6; }
        
        .status-grid {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 30px 0;
            background: #020203;
            border: 1px solid #1e293b;
            border-radius: 20px;
            padding: 20px;
        }
        .status-node {
            text-align: center;
            padding: 10px 15px;
        }
        .status-label { font-size: 10px; color: #475569; text-transform: uppercase; margin-bottom: 5px; }
        .status-value { color: #cbd5e1; font-weight: bold; font-family: monospace; }
        .status-arrow { color: #06b6d4; font-size: 20px; padding: 0 15px; }
        .new-value { color: #06b6d4; text-shadow: 0 0 10px rgba(6, 182, 212, 0.5); }

        .subject-text { color: #ffffff; font-size: 18px; font-weight: bold; margin-bottom: 5px; text-align: center;}
        
        .action-area { text-align: center; padding: 30px 0 10px; }
        .btn { 
            display: inline-block; background-color: #0891b2; color: #020203 !important; 
            padding: 18px 35px; border-radius: 14px; text-decoration: none; 
            font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;
        }
        
        .footer { padding: 30px; background-color: #050507; font-size: 10px; text-align: center; color: #475569; letter-spacing: 1px; }
        .system-id { color: #1e293b; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <h1>MARKET_LOOP_<span>SYSTEMS</span></h1>
            </div>

            <div class="content">
                <div class="subject-text">RE: ${subject}</div>
                <p style="text-align: center; font-size: 13px;">Protocol update detected. Ticket status has been modified.</p>
                
                <div class="status-grid">
                    <div class="status-node">
                        <div class="status-label">Previous</div>
                        <div class="status-value">${oldStatus}</div>
                    </div>
                    <div class="status-arrow"> >> </div>
                    <div class="status-node">
                        <div class="status-label">Current</div>
                        <div class="status-value new-value">${newStatus}</div>
                    </div>
                </div>

                <p>The administration has updated the processing stage of your inquiry. To review the changes or continue the communication, please re-sync with the support node:</p>

                <div class="action-area">
                    <a href="${accessUrl}" class="btn">Re-Sync_With_Node</a>
                </div>
            </div>

            <div class="footer">
                &copy; 2026 MARKET_LOOP_COMMERCE_PROTOCOL // STATUS_CHANGE_CONFIRMED <br>
                <div class="system-id">ENCRYPTED_LOG_ID: 0x${Math.floor(
                  Math.random() * 16777215,
                )
                  .toString(16)
                  .toUpperCase()}</div>
            </div>
        </div>
    </div>
</body>
</html>
`;

export default ticketStatusUpdateTemplate;
