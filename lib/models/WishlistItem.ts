import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWishlistItem extends Document {
  title: string;
  subject: string;
  curriculum: string;
  grade: string;
  status: "searching" | "potential" | "match";
  matchName?: string;
  matchDistance?: string;
  matchCount?: number;
  addedDaysAgo: number;
  createdAt: Date;
  updatedAt: Date;
}

const WishlistItemSchema = new Schema<IWishlistItem>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true, index: true },
    curriculum: { type: String, required: true },
    grade: { type: String, required: true },
    status: {
      type: String,
      enum: ["searching", "potential", "match"],
      default: "searching",
    },
    matchName: { type: String },
    matchDistance: { type: String },
    matchCount: { type: Number },
    addedDaysAgo: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const WishlistItem: Model<IWishlistItem> =
  mongoose.models.WishlistItem ??
  mongoose.model<IWishlistItem>("WishlistItem", WishlistItemSchema);

export default WishlistItem;
