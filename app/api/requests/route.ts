import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Request from "@/lib/models/Request";
import Listing from "@/lib/models/Listing";
import Notification from "@/lib/models/Notification";

export async function GET() {
  try {
    await connectDB();
    const requests = await Request.find().sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({ success: true, data: requests });
  } catch { return NextResponse.json({ success: false, error: "Failed" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { listingId } = await req.json();
    if (!listingId) return NextResponse.json({ success: false, error: "listingId required" }, { status: 400 });

    const listing = await Listing.findById(listingId).lean();
    if (!listing) return NextResponse.json({ success: false, error: "Listing not found" }, { status: 404 });

    const request = await Request.create({
      listingId, listingTitle: listing.title,
      requesterName: "You", sellerName: listing.seller, status: "pending",
    });

    await Notification.create({
      type: "system",
      text: `Your request for "${listing.title}" was sent to ${listing.seller}`,
      time: "Just now", read: false,
    });

    return NextResponse.json({ success: true, data: request }, { status: 201 });
  } catch { return NextResponse.json({ success: false, error: "Failed" }, { status: 500 }); }
}