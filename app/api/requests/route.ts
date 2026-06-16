import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Request from "@/lib/models/Request";
import Listing from "@/lib/models/Listing";
import Notification from "@/lib/models/Notification";

// GET /api/requests
export async function GET() {
  try {
    await connectDB();
    const requests = await Request.find().sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    console.error("GET /api/requests error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch requests" }, { status: 500 });
  }
}

// POST /api/requests — create a resource request for a listing
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { listingId } = body as { listingId: string };

    if (!listingId) {
      return NextResponse.json({ success: false, error: "listingId is required" }, { status: 400 });
    }

    const listing = await Listing.findById(listingId).lean();
    if (!listing) {
      return NextResponse.json({ success: false, error: "Listing not found" }, { status: 404 });
    }

    const request = await Request.create({
      listingId,
      listingTitle: listing.title,
      requesterName: "You",
      sellerName: listing.seller,
      status: "pending",
    });

    // Create a real notification so the dashboard reflects this action
    await Notification.create({
      type: "system",
      text: `Your request for "${listing.title}" was sent to ${listing.seller}`,
      time: "Just now",
      read: false,
    });

    return NextResponse.json({ success: true, data: request }, { status: 201 });
  } catch (error) {
    console.error("POST /api/requests error:", error);
    return NextResponse.json({ success: false, error: "Failed to create request" }, { status: 500 });
  }
}
