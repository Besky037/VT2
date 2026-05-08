import mongoose from "mongoose";

const timeLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    projectName: { type: String, required: true },
    description: { type: String },
    date: { type: String, required: true },
    clockIn: { type: String, required: true },
    clockOut: { type: String, required: true },
    totalHours: { type: Number, required: true },
  },
  { timestamps: true }
);

const TimeLog = mongoose.models.TimeLog || mongoose.model("TimeLog", timeLogSchema);
export default TimeLog;
