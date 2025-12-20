// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import dotenv from 'dotenv';
// import patientRoutes from './routes/patient.routes';
// import { notFound, errorHandler } from './utils/errorHandler';

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors({
//   origin: '*',
//   credentials: true
// }));
// app.use(helmet());
// app.use(morgan('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/patients', patientRoutes);

// // Error handling
// app.use(notFound);
// app.use(errorHandler);

// export default app;