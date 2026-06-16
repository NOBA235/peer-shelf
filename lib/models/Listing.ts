import mongoose, { Schema, Document, Model } from "mongoose";

export interface IListing extends Document {
  title: string;
  author: string;
  subject: string;
  curriculum: string;
  board: string;
  grade: string;
  price: number;
  originalPrice: number;
  condition: "Like New" | "Very Good" | "Good" | "Fair";
  location: string;
  city: string;
  notes: boolean;
  mentor: boolean;
  donated: boolean;
  exchange: boolean;
  image: string;
  color: string;
  seller: string;
  sellerInitials: string;
  rating: number;
  saves: number;
  type: "Textbook" | "Notes" | "Study Guide" | "Formula Sheet";
  description: string;
  included: string[];
  meetupPoint: string;
  listedDaysAgo: number;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    title: { type: String, required: true, index: true },
    author: { type: String, required: true },
    subject: { type: String, required: true, index: true },
    curriculum: { type: String, required: true },
    board: { type: String, required: true, index: true },
    grade: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    originalPrice: { type: Number, default: 0 },
    condition: {
      type: String,
      enum: ["Like New", "Very Good", "Good", "Fair"],
      required: true,
    },
    location: { type: String, required: true },
    city: { type: String, required: true, index: true },
    notes: { type: Boolean, default: false },
    mentor: { type: Boolean, default: false },
    donated: { type: Boolean, default: false },
    exchange: { type: Boolean, default: false },
    image: { type: String, default: "📚" },
    color: { type: String, default: "#7c3aed" },
    seller: { type: String, required: true },
    sellerInitials: { type: String, required: true },
    rating: { type: Number, default: 5.0 },
    saves: { type: Number, default: 0 },
    type: {
      type: String,
      enum: ["Textbook", "Notes", "Study Guide", "Formula Sheet"],
      required: true,
    },
    description: { type: String, default: "" },
    included: [{ type: String }],
    meetupPoint: { type: String, default: "" },
    listedDaysAgo: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text search index
ListingSchema.index({ title: "text", subject: "text", author: "text" });

const Listing: Model<IListing> =
  mongoose.models.Listing ?? mongoose.model<IListing>("Listing", ListingSchema);

export default Listing;
