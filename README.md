# MediPal 🏥

A healthcare management platform connecting patients and doctors. Book appointments, manage medical records, and access your digital health card - all in one place!

**Made with ❤️ by students**

## ✨ Features

**For Patients:**
- 📅 Book appointments with doctors
- 💳 Digital health card with unique MP-ID
- 🏥 View appointment history
- 📊 Track health records

**For Doctors:**
- 👨‍⚕️ Manage patient appointments
- ✅ Approve & complete consultations
- 🔍 Access patient information

## 🚀 Quick Start

### Backend
```bash
cd server
npm install
npm run dev
```
Server runs on `http://localhost:5000`

### Frontend
```bash
cd medipal-history
npm install
npm run dev
```
App runs on `http://localhost:3000`

### Environment Setup
Create `.env` in server folder:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🛠️ Tech Stack

- **Frontend:** Next.js, TypeScript, Material-UI
- **Backend:** Node.js, Express, MongoDB
- **Auth:** JWT
- **Storage:** Cloudinary

## 📋 Key Features

### Patient ID System
Every patient gets a unique ID: `MP-01YYYYMMDD`

### Appointment System
- Real-time booking
- Status tracking: Pending → Approved → Completed
- Works for both patients and doctors

## 📱 Contact

Need help? Open an issue or reach out to the team!

---
*A group project for healthcare management* 💙
