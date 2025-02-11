exports.verificationTemplate = (verificationUrl) => ({
  html: `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Verify Your Email Address</h2>
      <p>Please click the button below to verify your email address. This link will expire in 24 hours.</p>
      <a href="${verificationUrl}" 
         style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
        Verify Email
      </a>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p>${verificationUrl}</p>
      <p>If you didn't create an account, please ignore this email.</p>
    </div>
  `,
  text: `
    Verify Your Email Address
    
    Please click the following link to verify your email address (expires in 24 hours):
    ${verificationUrl}
    
    If you didn't create an account, please ignore this email.
  `
});

exports.resetPasswordTemplate = (resetUrl) => ({
  html: `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Reset Your Password</h2>
      <p>You requested to reset your password. Click the button below to create a new password. This link will expire in 1 hour.</p>
      <a href="${resetUrl}" 
         style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
        Reset Password
      </a>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p>${resetUrl}</p>
      <p>If you didn't request a password reset, please ignore this email and ensure your account is secure.</p>
    </div>
  `,
  text: `
    Reset Your Password
    
    You requested to reset your password. Click the following link to create a new password (expires in 1 hour):
    ${resetUrl}
    
    If you didn't request a password reset, please ignore this email and ensure your account is secure.
  `
});