import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.route.js";
import { mentorRouter } from "./routes/mentor.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";
import { RequireAuth } from "./middleware/requireauth.middleware.js";
import { bookingRoute } from "./routes/booking.route.js";
import { ErrorHandler } from "./middleware/errorhandler.middleware.js";

dotenv.config();

let dbConnection;

let corsOptions = { withCredentials: true, credentials: true };
const allowlist = ["http://localhost:5173", "https://mentor-site.vercel.app"];
const corsOptionsDelegate = function (req, callback) {
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions.origin = true;
  } else {
    corsOptions.origin = false;
  }
  callback(null, corsOptions);
};

connectDB()
  .then(({ conn }) => {
    dbConnection = conn;
  })
  .catch(error => {
    console.error(`Server Instance Error: ${error.message}`);
    process.exit(1);
  });

const app = express();
const BASENAME = process.env.API_BASENAME || "/api/v1";
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(
  cookieParser(process.env.SECRET, {
    httpOnly: true,
    secure: true,
  })
);
app.use(express.json());
app.use(cors(corsOptionsDelegate));

app.use(ErrorHandler);

app.use(`${BASENAME}/auth`, authRouter);
app.use(`${BASENAME}/mentors`, RequireAuth, mentorRouter);
app.use(`${BASENAME}/bookings`, RequireAuth, bookingRoute);

app.get("/", (req, res) => {
  console.log("Cookies [/]: ", req.cookies);
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("exit", () => {
  console.error(`Exiting the server...`);
  dbConnection?.disconnect();
});
