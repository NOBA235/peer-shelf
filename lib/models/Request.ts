import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRequest extends Document {
  listingId: mongoose.Types.ObjectId;
  listingTitle: string;
  requesterName: string;
  sellerName: string;
  status: "pending" | "accepted" | "declined";
  createdAt: Date;
  updatedAt: Date;
}

const RequestSchema = new Schema<IRequest>(
  {
    listingId:     { type: Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
    listingTitle:  { type: String, required: true },
    requesterName: { type: String, required: true, default: "You" },
    sellerName:    { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Request: Model<IRequest> =
  mongoose.models.Request ?? mongoose.model<IRequest>("Request", RequestSchema);

export default Request;
