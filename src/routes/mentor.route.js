import { Router } from "express";
import { MentorModel } from "../db/models/mentor.js";
import { createMentor } from "../service/mentor.service.js";

const mentorRouter = Router();

mentorRouter
  .get("/", async (req, res) => {
    const mentors = await MentorModel.find();
    res.status(200).json(mentors);
  })
  .get("/:email", async (req, res) => {
    const { email } = req.params;
    const mentor = await MentorModel.findOne({ email });
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.status(200).json(mentor);
  })
  .post("/", async (req, res) => {
    const { status, data } = await createMentor(req.body);
    res.status(status).json(data);
  });

export { mentorRouter };
