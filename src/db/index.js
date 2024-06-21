import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  let conn;
  try {
    conn = await mongoose.connect(process.env.DB_URL, {
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      },
    });

    console.log(`MongoDB Connected:`, { host: conn.connection.host });
  } catch (error) {
    console.error(`DB Connection Error: ${error.message}`);
    process.exit(1);
  }
  return { conn };
};

export default connectDB;
