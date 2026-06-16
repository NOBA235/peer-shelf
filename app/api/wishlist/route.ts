import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WishlistItem from "@/lib/models/WishlistItem";
import Listing from "@/lib/models/Listing";

// GET /api/wishlist
export async function GET() {
  try {
    await connectDB();
    const items = await WishlistItem.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("GET /api/wishlist error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

// POST /api/wishlist — create request + run matching engine
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // --- Matching Engine ---
    // Search for listings that match subject + curriculum
    const matches = await Listing.find({
      subject: { $regex: body.subject, $options: "i" },
      $or: [
        { curriculum: { $regex: body.curriculum, $options: "i" } },
        { grade: { $regex: body.grade, $options: "i" } },
      ],
    })
      .limit(5)
      .lean();

    let status: "searching" | "potential" | "match" = "searching";
    let matchName: string | undefined;
    let matchDistance: string | undefined;
    let matchCount: number | undefined;

    if (matches.length >= 2) {
      status = "potential";
      matchCount = matches.length;
    }

    if (matches.length >= 1) {
      const best = matches[0];
      status = "match";
      matchName = best.seller;
      matchDistance = `${(Math.random() * 4 + 0.5).toFixed(1)} km`;
    }

    const item = await WishlistItem.create({
      ...body,
      status,
      matchName,
      matchDistance,
      matchCount,
      addedDaysAgo: 0,
    });

    return NextResponse.json({ success: true, data: item, matches }, { status: 201 });
  } catch (error) {
    console.error("POST /api/wishlist error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create wishlist item" },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
    await WishlistItem.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/wishlist error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
