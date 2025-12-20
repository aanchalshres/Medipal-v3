// src/database.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection configuration with comprehensive timeout settings
const mongoOptions: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 30000,  // 30 seconds to select server
  socketTimeoutMS: 45000,          // 45 seconds for socket operations
  connectTimeoutMS: 30000,         // 30 seconds for initial connection
  maxPoolSize: 10,                 // Maximum connections in pool
  minPoolSize: 2,                  // Minimum connections in pool
  retryWrites: true,               // Enable retry for write operations
  retryReads: true,                // Enable retry for read operations
  waitQueueTimeoutMS: 20000,       // 20 seconds for operation queue
  heartbeatFrequencyMS: 10000,     // 10 seconds between heartbeat checks
};

// Connection event handlers
const setupConnectionEvents = () => {
  mongoose.connection.on('connecting', () => 
    console.log('Connecting to MongoDB...'));
  
  mongoose.connection.on('connected', () => 
    console.log('MongoDB connected successfully'));
  
  mongoose.connection.on('disconnected', () => 
    console.warn('MongoDB disconnected'));
  
  mongoose.connection.on('reconnected', () => 
    console.log('MongoDB reconnected'));
  
  mongoose.connection.on('error', (err) => 
    console.error('MongoDB connection error:', err));
};

// Main connection function
const connectDB = async () => {
  try {
    // Return if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('Using existing MongoDB connection');
      return;
    }

    // Setup event listeners
    setupConnectionEvents();

    // Enable debug mode in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', (collectionName, method, query, doc) => {
        console.log(`Mongoose: ${collectionName}.${method}`, {
          query: JSON.stringify(query),
          doc
        });
      });
    }

    // Attempt connection
    const conn = await mongoose.connect(process.env.MONGODB_URI as string, mongoOptions);
    
    console.log(`Connected to MongoDB cluster: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    console.log(`Connection state: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);

    return conn;
  } catch (error) {
    console.error('MongoDB connection failed:');
    console.error('Connection URI used:', process.env.MONGODB_URI);
    console.error('Error details:', error);
    
    // In production, exit process to allow for auto-restart
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    
    throw error;
  }
};

export default connectDB;