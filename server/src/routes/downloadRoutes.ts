import { Router, Request, Response } from 'express';
import twilio from 'twilio';

const router = Router();

interface SendDownloadLinkBody {
  phoneNumber: string;
}

router.post(
  '/send-download-link',
  async (req: Request<{}, {}, SendDownloadLinkBody>, res: Response) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    try {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

      const message = await client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: phoneNumber,
        body: "Download the MediPal app here: https://example.com/download",
      });

      console.log("✅ SMS sent:", message.sid);
      return res.status(200).json({ success: true, message: "Download link sent to your phone!" });
    } catch (err) {
      console.error("❌ Error sending SMS:", err);
      return res.status(500).json({ success: false, message: "Failed to send SMS" });
    }
  }
);

export default router;
