import { Request, Response } from 'express';
import PhoneNumber, { IPhoneNumber } from '../models/PhoneNumber';
import { sendDownloadLinkSMS } from './../services/smsService';
import { validatePhoneNumber, formatPhoneNumber } from './../services/validationService';

export const sendDownloadLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber } = req.body;
    const countryCode = '+977'; // Default country code for Nepal

    // Validate phone number
    if (!phoneNumber) {
      res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      res.status(400).json({
        success: false,
        message: 'Please enter a valid phone number'
      });
      return;
    }

    // Format phone number
    const formattedNumber = formatPhoneNumber(phoneNumber, countryCode);

    // Check if this number has already requested a download link recently
    const existingRequest = await PhoneNumber.findOne({
      fullNumber: formattedNumber,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Within last 24 hours
    });

    if (existingRequest) {
      res.status(400).json({
        success: false,
        message: 'Download link has already been sent to this number recently'
      });
      return;
    }

    // Save to database
    const phoneRecord = new PhoneNumber({
      phoneNumber: phoneNumber.replace(/\D/g, ''),
      countryCode,
      fullNumber: formattedNumber
    });

    await phoneRecord.save();

    // Send SMS (in production)
    if (process.env.NODE_ENV === 'production') {
      const smsSent = await sendDownloadLinkSMS(formattedNumber);
      
      if (smsSent) {
        phoneRecord.messageSent = true;
        await phoneRecord.save();
      }
    } else {
      // In development, just simulate success
      console.log(`Simulated SMS sent to: ${formattedNumber}`);
      phoneRecord.messageSent = true;
      await phoneRecord.save();
    }

    res.status(200).json({
      success: true,
      message: 'Download link sent to your phone!'
    });

  } catch (error) {
    console.error('Error in sendDownloadLink:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getDownloadStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get total download requests
    const totalRequests = await PhoneNumber.countDocuments();
    
    // Get requests from last 24 hours
    const last24Hours = await PhoneNumber.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    
    // Get requests from last 7 days
    const last7Days = await PhoneNumber.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalRequests,
        last24Hours,
        last7Days
      }
    });
  } catch (error) {
    console.error('Error in getDownloadStats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};