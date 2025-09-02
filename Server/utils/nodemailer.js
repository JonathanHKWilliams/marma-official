import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

/**
 * Send registration confirmation email
 * @param {object} registrationData - Registration data object containing user details
 * @returns {Promise<object>} - Email sending result
 */
export const sendEmail = async (registrationData) => {
    try {
        // Configure transporter for Gmail with more robust settings
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD, // Must be an app-specific password
            },
            tls: {
                rejectUnauthorized: false // Helps with SSL certificate issues
            },
            // Set pool to true to use connection pool for better reliability
            pool: true,
            // Set sensible timeouts
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000, // 10 seconds
            socketTimeout: 15000 // 15 seconds
        });

        // Set up email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: registrationData.email,
            subject: 'MARMA Registration Confirmation',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <img src="https://your-logo-url.com" alt="MARMA Logo" style="max-width: 150px;">
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






