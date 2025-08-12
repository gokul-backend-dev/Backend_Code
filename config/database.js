import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export async function connectDB() {
    try {
        console.log("🚀 ~ connectDB ~ process.env.MONGODB_URI:", process.env.MONGODB_URI)
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack-oauth-app', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
}
