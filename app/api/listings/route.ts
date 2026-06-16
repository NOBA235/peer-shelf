import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/lib/models/Listing";
import type { SortOrder } from "mongoose";

// GET /api/listings — fetch all with optional filters
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    const city = searchParams.get("city");
    const board = searchParams.get("board");
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") ?? "createdAt";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    if (subject && subject !== "All") query.subject = subject;
    if (city && city !== "All Cities") query.city = city;
    if (board && board !== "All Boards") query.board = board;
    if (type && type !== "All Types") query.type = type;
    if (search) query.$text = { $search: search };

    const sortMap: Record<string, Record<string, SortOrder>> = {
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      saves: { saves: -1 },
      createdAt: { createdAt: -1 },
    };

    const listings = await Listing.find(query)
      .sort(sortMap[sortBy] ?? { createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ success: true, data: listings });
  } catch (error) {
    console.error("GET /api/listings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

// POST /api/listings — create a new listing
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const listing = await Listing.create(body);
    return NextResponse.json({ success: true, data: listing }, { status: 201 });
  } catch (error) {
    console.error("POST /api/listings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create listing" },
      { status: 500 }
    );
  }
}
