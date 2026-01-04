import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendMagicLink = async (email: string, token: string): Promise<void> => {
  const magicLink = `${process.env.FRONTEND_URL}/auth/callback?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Connexion à AI Story Forge',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 AI Story Forge</h1>
          </div>
          <div class="content">
            <h2>Connexion à votre compte</h2>
            <p>Bonjour,</p>
            <p>Cliquez sur le bouton ci-dessous pour vous connecter à AI Story Forge :</p>
            <center>
              <a href="${magicLink}" class="button">Se connecter</a>
            </center>
            <p>Ou copiez ce lien dans votre navigateur :</p>
            <p style="background: white; padding: 10px; border-radius: 5px; word-break: break-all;">${magicLink}</p>
            <p><strong>Ce lien expire dans 15 minutes.</strong></p>
            <p>Si vous n'avez pas demandé cette connexion, ignorez cet email.</p>
          </div>
          <div class="footer">
            <p>AI Story Forge - Créez des ebooks extraordinaires avec l'IA</p>
            <p>&copy; 2026 AI Story Forge. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (email: string, name?: string): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Bienvenue sur AI Story Forge !',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>Bienvenue ${name || ''} ! 🎉</h1>
          <p>Merci de nous avoir rejoint sur AI Story Forge.</p>
          <p>Vous pouvez maintenant créer des ebooks incroyables avec l'aide de l'IA !</p>
          <p>Commencez dès maintenant :</p>
          <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Accéder au Dashboard
          </a>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
