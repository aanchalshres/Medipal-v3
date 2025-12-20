import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Define the JWT payload structure
interface JwtPayload {
  id: string;
  role: string;
  phone: string;
  // Add other claims as needed
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded; // Now TypeScript knows about the user property
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};