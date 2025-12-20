import { twilioClient } from '../config/twilio';

export const sendDownloadLinkSMS = async (phoneNumber: string): Promise<boolean> => {
  try {
    const message = await twilioClient.messages.create({
      body: 'Thank you for your interest in MediPal! Download our app here: https://medipal.com/download',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    
    console.log(`SMS sent to ${phoneNumber} with SID: ${message.sid}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
};