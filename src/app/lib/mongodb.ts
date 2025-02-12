import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    if (!process.env.MONGODB_URI) {
        throw new Error("Missing MONGODB_URI environment variable");
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('Error connecting to MongoDB:', err.message);
        } else {
            console.error('Error connecting to MongoDB');
        }
    }
}

export default connectDB;