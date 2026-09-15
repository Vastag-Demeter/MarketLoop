export const activationEmailTemplate = (code) => {
  return `
  <div style="background-color: #0f172a; padding: 40px 20px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; text-align: center; color: #ffffff;">
    <div style="max-width: 400px; margin: auto; background-color: #1e293b; padding: 30px; border-radius: 20px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
      <h1 style="margin: 0 0 15px 0; font-size: 24px; color: #22d3ee;">Account Activation</h1>
      <p style="color: #94a3b8; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
        Use this code to activate your account:
      </p>
      <div style="background-color: #0f172a; border: 2px solid #22d3ee; border-radius: 12px; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #22d3ee; margin-bottom: 25px;">
        ${code}
      </div>
      <div style="display: inline-block; background-color: rgba(34, 211, 238, 0.1); color: #22d3ee; padding: 8px 16px; border-radius: 50px; font-size: 14px; font-weight: 500;">
        ⏱️ The code expires in 10 minutes
      </div>
      <p style="margin-top: 30px; font-size: 12px; color: #64748b; line-height: 1.4;">
        If you didn't ask for the code, ignore this email.
      </p>
    </div>
  </div>
  `;
};
