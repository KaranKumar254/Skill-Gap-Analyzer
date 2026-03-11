import mongoose from "mongoose";

const MONGO_URI = "MONGO_URI=mongodb+srv://230101120254_db_user:Karan12@karan.alv6hlx.mongodb.net/skillgap?retryWrites=true&w=majority&appName=Karan
";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
