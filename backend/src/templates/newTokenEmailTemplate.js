// templates.js
export const newTokenEmailTemplate = (verificationUrl) => {
  return `
  <div style="background-color: #0f172a; padding: 40px 20px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; text-align: center; color: #ffffff;">
    <div style="max-width: 500px; margin: auto; background-color: #1e293b; padding: 40px; border-radius: 20px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
      
      <h1 style="margin: 0 0 15px 0; font-size: 26px; color: #22d3ee;">Email Verification</h1>
      
      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
        Your previous verification link has expired. Don't worry, you can easily verify your account by clicking the button below:
      </p>

      <a href="${verificationUrl}" 
         style="background: linear-gradient(90deg, #06b6d4, #22d3ee); color: #0f172a; padding: 16px 32px; text-decoration: none; border-radius: 12px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(34, 211, 238, 0.4); text-transform: uppercase; letter-spacing: 1px;">
         Verify Account Now
      </a>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #334155;">
        <p style="font-size: 13px; color: #64748b; margin: 0;">
          ⏱️ This new link is valid for the next 24 hours.
        </p>
        <p style="font-size: 11px; color: #475569; margin-top: 15px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <span style="color: #22d3ee; word-break: break-all;">${verificationUrl}</span>
        </p>
      </div>

    </div>
  </div>
  `;
};
