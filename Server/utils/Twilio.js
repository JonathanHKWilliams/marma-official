import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken) {
  console.warn('Twilio credentials not set in environment variables.');
}

const twilioClient = twilio(accountSid, authToken);

export { twilioClient, TWILIO_PHONE_NUMBER };
