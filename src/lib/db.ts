import mongoose from "mongoose";

export async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) return;
    
    const uri = process.env.MONGODB_URI!;
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      ssl: true,
      tls: true,
    });
    
    console.log("MongoDB connected!");
  } catch (error) {
    console.error("Connection error:", error);
    throw error;
  }
}