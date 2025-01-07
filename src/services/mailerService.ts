import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import path from 'path';
import TemplateService from './templateService';

class Mailer {
  private transporter: nodemailer.Transporter;
  private baseUrl: string;
  private senderEmail: string;
  private templateService: TemplateService;

  constructor() {
    const smtpConfig = {
      host: 'frweb11.pulseheberg.net',
      port: 465,
      secure: true,
      auth: {
        user: 'archistock@fiddle.fr',
        pass: 'p6$5Bgu65',
      },
    };

    this.transporter = nodemailer.createTransport(smtpConfig);
    this.templateService = new TemplateService(path.join(__dirname, '../emailTemplates'));
    this.baseUrl = process.env.BASE_URL || 'http://localhost:5173';
    this.senderEmail = 'archistock@fiddle.fr';
  }

  private async sendMail(
    from: string,
    to: string,
    subject: string,
    text: string,
    html: string
  ): Promise<void> {
    const mailOptions = {
      from,
      to,
      subject,
      text,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`Email sending failed: ${error}`);
    }
  }

  private generateTemporaryLink(userId: string, expiration: string, type: string): string {
    const token = jwt.sign({ userId }, process.env.SECRET_KEY!, { expiresIn: expiration });
    return `${this.baseUrl}/temp/${type}/${token}`;
  }

  public async sendInvitationEmail(
    to: string,
    email: string,
    companyName: string,
    role: string,
    invitationUUID: string,
    hasAccount: boolean
  ): Promise<void> {
    const subject = `Invitation à rejoindre ${companyName}`;
    const templateName = hasAccount
      ? 'invitationRequestWithAccount'
      : 'invitationRequestWithoutAccount';

    const confirmationLink = hasAccount
      ? `${this.baseUrl}/login`
      : `${this.baseUrl}/register/invitation/${invitationUUID}`;

    const html = this.templateService.renderTemplate(templateName, {
      email,
      companyName,
      role,
      confirmationLink,
    });

    await this.sendMail(this.senderEmail, to, subject, '', html);
  }

  public async sendPasswordResetEmail(to: string, userId: string): Promise<void> {
    const resetLink = this.generateTemporaryLink(userId, '1h', 'reset-password');
    const subject = 'Réinitialisation de mot de passe';
    const html = this.templateService.renderTemplate('resetPasswordTemplate', { resetLink });

    await this.sendMail(this.senderEmail, to, subject, '', html);
  }

  public async sendWelcomeEmail(to: string, firstName: string, lastName: string): Promise<void> {
    const subject = 'Bienvenue';
    const html = this.templateService.renderTemplate('welcomeTemplate', { firstName, lastName });

    await this.sendMail(this.senderEmail, to, subject, '', html);
  }

  public async sendAccountConfirmationEmail(to: string, userId: string): Promise<void> {
    const confirmationLink = this.generateTemporaryLink(userId, '5d', 'confirm-account');
    const subject = 'Confirmation de compte';
    const html = `<p>Bonjour,</p><p>Merci de vous être inscrit sur notre site. Veuillez cliquer sur le lien suivant pour confirmer votre compte :</p><p><a href="${confirmationLink}">${confirmationLink}</a></p>`;

    await this.sendMail(this.senderEmail, to, subject, '', html);
  }
}

export default Mailer;
