import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  type: "match" | "mentor" | "save" | "review" | "system";
  text: string;
  time: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: ["match", "mentor", "save", "review", "system"],
      required: true,
    },
    text: { type: String, required: true },
    time: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification: Model<INotification> =
  mongoose.models.Notification ??
  mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
