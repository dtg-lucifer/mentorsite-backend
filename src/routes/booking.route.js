import { Router } from "express";
import { BookingModel } from "../db/models/booking.js";
import { createMeetingSpace } from "../gmeet/index.js";
import { UserModel } from "../db/models/user.js";
import { MentorModel } from "../db/models/mentor.js";
import { sendEmail } from "../service/mailer.service.js";

const bookingRoute = Router();

bookingRoute
  .get("/", async (req, res) => {
    try {
      const allBooking = await BookingModel.find()
        .populate("mentor")
        .populate("user", "firstName lastName email");

      res.status(200).json(allBooking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post("/", async (req, res) => {
    const { mentor, user, date } = req.body;

    let meetingSpace;

    const userExist = await UserModel.findOne({ email: user });
    const mentorExist = await MentorModel.findOne({ email: mentor });

    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!mentorExist) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    try {
      meetingSpace = await createMeetingSpace();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }

    try {
      const { url, name, error } = meetingSpace;

      if (error) {
        return res.status(500).json({ message: error });
      }

      const newBooking = new BookingModel({
        mentor: mentorExist._id,
        user: userExist._id,
        date,
        event: name,
        meetingUrl: url,
      });

      const savedBooking = await newBooking.save();

      const populatedBooking = await BookingModel.findById(savedBooking._id)
        .populate("user", "firstName lastName email")
        .populate("mentor")
        .exec();

      console.log("Successfully created new booking: ", populatedBooking);

      const meetingDetails = `
				<p>Dear ${userExist.firstName} ${userExist.lastName} and ${mentorExist.fullName},</p>
				<p>Your meeting has been scheduled as follows:</p>
				<p><strong>Event:</strong> ${name}</p>
				<p><strong>Date:</strong> ${new Date(date).toLocaleString()}</p>
				<p><strong>Meeting URL:</strong> <a href="${url}">${url}</a></p>
				<p>Status: ${savedBooking.status}</p>
    	`;

			await sendEmail(
				userExist.email,
				'Meeting Scheduled',
				`Your meeting for the event name ${name} has been scheduled. [ID: ${savedBooking._id}].`,
				meetingDetails
			);
	
			await sendEmail(
				mentorExist.email,
				'Meeting Scheduled',
				`Your meeting for the event name ${name} has been scheduled [ID: ${savedBooking._id}].`,
				meetingDetails
			);

      res.status(201).json(populatedBooking);
    } catch (error) {
      console.log("Error creating new booking: ", error);
      res.status(500).json({ message: error.message });
    }
  });

export { bookingRoute };
