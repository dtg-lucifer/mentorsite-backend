import { Schema, model } from "mongoose";

const MentorSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "First name is required"],
  },
  contactNo: {
    type: Number,
    required: [true, "Contact number is required"],
    validate: {
      validator: function (v) {
        return v.length === 10;
      },
      message: ({ value }) =>
        `${value} is not a valid contact number! Contact number should be 10 digits long.`,
    },
  },
  skills: {
    type: [String],
    required: [true, "Skills are required"],
  },
  companyName: {
    type: String,
    required: [true, "Company name is required"],
  },
  experience: {
    type: Number,
    required: [true, "Experience is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
});

const MentorModel = model("Mentor", MentorSchema, "mentor_details");

export { MentorModel, MentorSchema };
