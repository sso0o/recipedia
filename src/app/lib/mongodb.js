// lib/mongodb.js
import mongoose from 'mongoose';

const connectMongoDB = async () => {
    try {
        // await mongoose.connect("mongodb+srv://sssssoyyyy:DcJ5nSVi6XoLpf1W@cluster0.53qv2.mongodb.net/recipedia");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
    }
}

export default connectMongoDB;