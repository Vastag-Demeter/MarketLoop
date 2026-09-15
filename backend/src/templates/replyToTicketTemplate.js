const techEmailTemplate = (subject, message, accessUrl) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { 
            background-color: #020203; 
            margin: 0; 
            padding: 0; 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        }
        .wrapper { 
            background-color: #020203; 
            padding: 40px 10px; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #0a0a0c;
            border: 1px solid #1e293b; 
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }
        .header { 
            padding: 30px; 
            background: linear-gradient(to bottom, #0f172a, #0a0a0c);
            text-align: center;
            border-bottom: 1px solid #1e293b;
        }
        .header h1 { 
            margin: 0; 
            color: #ffffff; 
            font-size: 20px; 
            text-transform: uppercase; 
            letter-spacing: 4px;
            font-style: italic;
            font-weight: 900;
        }
        .header h1 span { color: #06b6d4; }
        
        .content { 
            padding: 40px 30px; 
            color: #94a3b8; 
            line-height: 1.6; 
        }
        .subject-line { 
            font-size: 11px; 
            text-transform: uppercase; 
            color: #06b6d4; 
            font-weight: bold; 
            letter-spacing: 2px;
            margin-bottom: 5px;
        }
        .subject-text {
            color: #ffffff;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 25px;
        }
        .message-container { 
            background: #020203; 
            border: 1px solid #1e293b; 
            border-radius: 16px;
            padding: 20px; 
            margin: 20px 0;
            color: #cbd5e1; 
            font-size: 14px;
            font-family: 'Courier New', Courier, monospace;
        }
        
        .action-area {
            text-align: center;
            padding: 20px 0 10px;
        }
        .btn { 
            display: inline-block;
            background-color: #0891b2; 
            color: #020203 !important; 
            padding: 18px 35px; 
            border-radius: 14px;
            text-decoration: none; 
            font-weight: 900; 
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            box-shadow: 0 4px 15px rgba(8, 145, 178, 0.3);
        }
        
        .footer { 
            padding: 30px; 
            background-color: #050507;
            font-size: 10px; 
            text-align: center; 
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .system-id {
            color: #1e293b;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <h1>MARKET_LOOP_<span>SYSTEMS</span></h1>
            </div>

            <div class="content">
                <div class="subject-line">Incoming_Transmission</div>
                <div class="subject-text">RE: ${subject}</div>
                
                <p>Greetings Citizen,</p>
                <p>Our administration team has processed your inquiry. The official response is detailed below:</p>
                
                <div class="message-container">
                    ${message.replace(/\n/g, "<br>")}
                </div>

                <p>To view the full conversation history or provide additional data, use the secure link below:</p>

                <div class="action-area">
                    <a href="${accessUrl}" class="btn">Access_Support_Node</a>
                </div>
            </div>

            <div className="footer">
                &copy; 2026 MARKET_LOOP_COMMERCE_PROTOCOL // TERMINAL_ID: 0x${Math.floor(
                  Math.random() * 16777215,
                )
                  .toString(16)
                  .toUpperCase()} <br>
                <div class="system-id">SECURE_AES_256_ENCRYPTION_ACTIVE</div>
            </div>
        </div>
    </div>
</body>
</html>
`;

export default techEmailTemplate;
