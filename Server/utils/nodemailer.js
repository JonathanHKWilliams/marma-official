import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Send registration confirmation email
 * @param {object} registrationData - Registration data object containing user details
 * @returns {Promise<object>} - Email sending result
 */
export const sendEmail = async (registrationData) => {
    try {
        // Configure transporter for Gmail with robust, production-oriented settings
        const transporter = createMailTransport();

        // Set up email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: registrationData.email,
            subject: 'MARMA Registration Confirmation',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <img src="cid:marmaLogo" alt="MARMA Logo" style="max-width: 150px;">
                  <h2 style="color: #003366; margin-top: 10px;">Mano River Ministerial Alliance</h2>
                </div>
                
                <p>Dear ${registrationData.fullName},</p>
                
                <p>Thank you for registering with the Mano River Ministerial Alliance. Your registration has been received and is currently under review by our administrative team.</p>
                
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <h3 style="color: #003366; margin-top: 0;">Registration Details</h3>
                  <p><strong>Name:</strong> ${registrationData.fullName}</p>
                  <p><strong>Email:</strong> ${registrationData.email}</p>
                  <p><strong>Phone:</strong> ${registrationData.phone}</p>
                  <p><strong>Country:</strong> ${registrationData.country}</p>
                  <p><strong>Regional Code:</strong> ${registrationData.regionalCode}</p>
                  <p><strong>ID Number:</strong> ${registrationData.identificationNumber}</p>
                  <p><strong>Status:</strong> Pending Review</p>
                </div>
                
                <p>You will receive another email once your registration has been processed. If you have any questions, please contact us at support@marma.org.</p>
                
                <p>Best regards,<br>The MARMA Team</p>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px;">
                  <p>This is an automated message. Please do not reply to this email.</p>
                  <p>© ${new Date().getFullYear()} Mano River Ministerial Alliance. All rights reserved.</p>
                </div>
              </div>
            `,
            attachments: [
              {
                filename: 'logo.png',
                path: path.join(__dirname, '../assets/MARMA Logo.png'), // local file path
                cid: 'marmaLogo' // same cid as in the img src
              }
            ]
          };
      

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${registrationData.email}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Re-throw to allow handling by the caller
    }
};

/**
 * Send approval email to a member once their registration is approved
 * @param {object} registrationData - The registration instance/data
 * @param {string} message - Optional message from admin
 */
export const sendApprovalEmail = async (registrationData, message = '') => {
  const transporter = createMailTransport();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: registrationData.email,
    subject: 'MARMA Membership Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:marmaLogo" alt="MARMA Logo" style="max-width: 150px;">
          <h2 style="color: #003366; margin-top: 10px;">Mano River Ministerial Alliance</h2>
        </div>
        <p>Dear ${registrationData.fullName},</p>
        <p>We are pleased to inform you that your membership application has been <strong>approved</strong>.</p>
        ${message ? `<div style="background:#f5faff;border:1px solid #dbeafe;padding:12px;border-radius:8px"><p style="margin:0"><strong>Message from Admin:</strong> ${message}</p></div>` : ''}
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #003366; margin-top: 0;">Your Membership Details</h3>
          <p><strong>Regional Code:</strong> ${registrationData.regionalCode || 'Pending'}</p>
          <p><strong>Identification Number:</strong> ${registrationData.identificationNumber || 'Pending'}</p>
          <p><strong>Status:</strong> Approved</p>
        </div>
        <p>Welcome to MARMA. We will follow up with additional next steps.</p>
        <p>Warm regards,<br/>The MARMA Team</p>
      </div>
    `,
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '../assets/MARMA Logo.png'), // local file path
        cid: 'marmaLogo' // same cid as in the img src
      }
    ]
  };
  const info = await transporter.sendMail(mailOptions);
  console.log(`Approval email sent to ${registrationData.email}: ${info.messageId}`);
  return info;
};

/**
 * Send rejection email to a member with reason
 * @param {object} registrationData - The registration instance/data
 * @param {string} reason - Reason for rejection
 */
export const sendRejectionEmail = async (registrationData, reason = '') => {
  const transporter = createMailTransport();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: registrationData.email,
    subject: 'MARMA Membership Application Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:marmaLogo" alt="MARMA Logo" style="max-width: 150px;">
          <h2 style="color: #003366; margin-top: 10px;">Mano River Ministerial Alliance</h2>
        </div>
        <p>Dear ${registrationData.fullName},</p>
        <p>Thank you for your interest in joining the Mano River Ministerial Alliance. After careful review, we are unable to approve your application at this time.</p>
        ${reason ? `<div style="background:#fff7ed;border:1px solid #fed7aa;padding:12px;border-radius:8px"><p style="margin:0"><strong>Reason:</strong> ${reason}</p></div>` : ''}
        <p>You are welcome to contact us at support@marma.org for further clarification or to reapply in the future.</p>
        <p>Kind regards,<br/>The MARMA Team</p>
      </div>
    `,
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '../assets/MARMA Logo.png'), // local file path
        cid: 'marmaLogo' // same cid as in the img src
      }
    ]
  };
  const info = await transporter.sendMail(mailOptions);
  console.log(`Rejection email sent to ${registrationData.email}: ${info.messageId}`);
  return info;
};

/**
 * Create a reusable Nodemailer transporter using environment config
 */
function createMailTransport() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT || 465),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
    pool: true,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}





