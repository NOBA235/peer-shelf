import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMentor extends Document {
  userId?: mongoose.Types.ObjectId | string;
  email?: string;
  image?: string;

  name: string;
  initials: string;
  grade: string;
  achievement: string;
  subject: string;
  rating: number;
  reviews: number;
  location: string;
  books: string[];
  bio: string;
  sessions: number;
  notesShared: number;
  studentsHelped: number;
  subjects: string[];
  board: string;
  quote: string;
  createdAt: Date;
  updatedAt: Date;
}
const MentorSchema = new Schema<IMentor>(
  {
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    email:  { type: String },
    image:  { type: String },
    initials: { type: String, required: true },
    grade: { type: String, required: true },
    achievement: { type: String, required: true },
    subject: { type: String, required: true, index: true },
    rating: { type: Number, default: 5.0 },
    reviews: { type: Number, default: 0 },
    location: { type: String, required: true },
    books: [{ type: String }],
    bio: { type: String, default: "" },
    sessions: { type: Number, default: 0 },
    notesShared: { type: Number, default: 0 },
    studentsHelped: { type: Number, default: 0 },
    subjects: [{ type: String }],
    board: { type: String, required: true },
    quote: { type: String, default: "" },
  },
  { timestamps: true }
);

MentorSchema.index({ name: "text", subject: "text" });

const Mentor: Model<IMentor> =
  mongoose.models.Mentor ?? mongoose.model<IMentor>("Mentor", MentorSchema);

export default Mentor;
