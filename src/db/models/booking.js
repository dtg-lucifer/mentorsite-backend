import { model, Schema } from "mongoose";

export const BookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
		mentor: {
			type: Schema.Types.ObjectId,
			ref: "Mentor",
			required: [true, "Mentor is required"],
		},
    event: {
      type: String,
      required: [true, "Event is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      validate: {
        validator: function (v) {
          return v >= new Date();
        },
        message: ({ value }) =>
          `${value} is not a valid event date! Date should be in the future.`,
      },
    },
    meetingUrl: {
      type: String,
      required: [true, "Meeting URL is required"],
      validate: {
        validator: function (v) {
          return v.startsWith("https://meet.google.com/");
        },
        message: ({ value }) =>
          `${value} is not a valid meeting URL! URL should start with "https://meet.google.com/".`,
      },
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

BookingSchema.pre("save", function (next) {
  if (!this.isModified("date")) {
    return next();
  }
  if (this.date < new Date()) {
    const err = new Error("Event date must be in the future");
    return next(err);
  }
  next();
});

BookingSchema.statics.findByStatus = async function (status) {
  return await this.find({ status });
};

BookingSchema.methods.updateStatus = async function (newStatus) {
  this.status = newStatus;
  return await this.save();
};

BookingSchema.post("save", function (error, doc, next) {
  if (error.name === "ValidationError") {
    doc.status = "REJECTED";
    next(new Error("Validation error: " + error.message));
  } else {
    doc.status = "REJECTED";
    next(error);
  }
});

export const BookingModel = model("Booking", BookingSchema, "bookings");
