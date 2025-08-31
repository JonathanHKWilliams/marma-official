// Email configuration constants
const EMAIL_FROM = import.meta.env.VITE_APP_EMAIL_FROM || 'marmalliance@gmail.com';
const ADMIN_EMAIL = import.meta.env.VITE_APP_ADMIN_EMAIL || 'marmalliance@gmail.com';

// Email sending function
const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  // Check if we're in production mode with API endpoint
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  
  if (apiUrl) {
    try {
      // Send email via backend API
      const response = await fetch(`${apiUrl}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          html,
          from: EMAIL_FROM
        })
      });
      
      if (!response.ok) {
        throw new Error(`Email API error: ${response.status}`);
      }
      
      console.log('Email sent successfully via API');
    } catch (error) {
      console.error('Error sending email via API:', error);
      throw error;
    }
  } else {
    // Development mode - simulate email sending
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${html}`);
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    console.log('Email sent successfully (simulated)');
  }
};

// Registration confirmation email
export const sendRegistrationConfirmation = async (
  email: string,
  fullName: string,
  registrationData: any
): Promise<void> => {
  try {
    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: 'MARMA Registration Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://your-logo-url.com" alt="MARMA Logo" style="max-width: 150px;">
            <h2 style="color: #003366; margin-top: 10px;">Mano River Ministerial Alliance</h2>
          </div>
          
          <p>Dear ${fullName},</p>
          
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

    await sendEmail(email, mailOptions.subject, mailOptions.html);
    console.log(`Registration confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending registration confirmation email:', error);
    throw new Error('Failed to send registration confirmation email');
  }
};

// Admin approval/denial notification
export const sendStatusNotification = async (
  email: string,
  fullName: string,
  status: 'approved' | 'declined',
  message: string,
  registrationData: any
): Promise<void> => {
  try {
    const statusText = status === 'approved' ? 'Approved' : 'Declined';
    const statusColor = status === 'approved' ? '#28a745' : '#dc3545';
    const nextStepsText = status === 'approved'
      ? 'Your membership has been approved. Please find your official membership details below.'
      : 'Please review the feedback below and consider reapplying if appropriate.';

    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: `MARMA Registration ${statusText}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://your-logo-url.com" alt="MARMA Logo" style="max-width: 150px;">
            <h2 style="color: #003366; margin-top: 10px;">Mano River Ministerial Alliance</h2>
          </div>
          
          <p>Dear ${fullName},</p>
          
          <p>Your MARMA registration has been <span style="font-weight: bold; color: ${statusColor};">${statusText.toLowerCase()}</span>.</p>
          
          <p>${nextStepsText}</p>
          
          ${status === 'approved' ? `
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #003366; margin-top: 0;">Membership Details</h3>
            <p><strong>Name:</strong> ${registrationData.fullName}</p>
            <p><strong>Email:</strong> ${registrationData.email}</p>
            <p><strong>Phone:</strong> ${registrationData.phone}</p>
            <p><strong>Country:</strong> ${registrationData.country}</p>
            <p><strong>Regional Code:</strong> ${registrationData.regionalCode}</p>
            <p><strong>ID Number:</strong> ${registrationData.identificationNumber}</p>
          </div>
          ` : ''}
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #003366; margin-top: 0;">Message from Administrator</h3>
            <p>${message}</p>
          </div>
          
          <p>If you have any questions, please contact us at support@marma.org.</p>
          
          <p>Best regards,<br>The MARMA Team</p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px;">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} Mano River Ministerial Alliance. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await sendEmail(email, mailOptions.subject, mailOptions.html);
    console.log(`Registration ${status} email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending registration ${status} email:`, error);
    throw new Error(`Failed to send registration ${status} email`);
  }
};

// Admin notification of new registration
export const notifyAdminOfNewRegistration = async (
  registrationData: any
): Promise<void> => {
  try {
    const adminEmail = ADMIN_EMAIL;
    
    const mailOptions = {
      from: EMAIL_FROM,
      to: adminEmail,
      subject: 'New MARMA Registration Submission',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="../assets/MarmaLogo.png" alt="MARMA Logo" style="max-width: 150px;">
            <h2 style="color: #003366; margin-top: 10px;">Mano River Ministerial Alliance</h2>
          </div>
          
          <p>Dear Administrator,</p>
          
          <p>A new registration has been submitted and requires your review.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #003366; margin-top: 0;">Registration Details</h3>
            <p><strong>Name:</strong> ${registrationData.fullName}</p>
            <p><strong>Email:</strong> ${registrationData.email}</p>
            <p><strong>Phone:</strong> ${registrationData.phone}</p>
            <p><strong>Country:</strong> ${registrationData.country}</p>
            <p><strong>Gender:</strong> ${registrationData.gender || 'Not specified'}</p>
            <p><strong>Church/Organization:</strong> ${registrationData.churchOrganization || 'Not specified'}</p>
            <p><strong>Position:</strong> ${registrationData.position || 'Not specified'}</p>
            <p><strong>Regional Code:</strong> ${registrationData.regionalCode}</p>
            <p><strong>ID Number:</strong> ${registrationData.identificationNumber}</p>
          </div>
          
          <p>Please log in to the admin dashboard to review this registration.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://marma.org/admin" style="background-color: #003366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Admin Dashboard</a>
          </div>
          
          <p>Best regards,<br>The MARMA System</p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px;">
            <p>This is an automated message.</p>
            <p>© ${new Date().getFullYear()} Mano River Ministerial Alliance. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await sendEmail(adminEmail, mailOptions.subject, mailOptions.html);
    console.log(`Admin notification email sent for new registration: ${registrationData.fullName}`);
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    throw new Error('Failed to send admin notification email');
  }
};
