import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/lib/models/Listing";

// GET /api/listings/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const listing = await Listing.findById(id).lean();

    if (!listing) {
      return NextResponse.json(
        { success: false, error: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: listing });
  } catch (error) {
    console.error("GET /api/listings/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}

// PATCH /api/listings/[id] — update saves, condition etc.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const listing = await Listing.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!listing) {
      return NextResponse.json(
        { success: false, error: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: listing });
  } catch (error) {
    console.error("PATCH /api/listings/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update listing" },
      { status: 500 }
    );
  }
}

// DELETE /api/listings/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    await Listing.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Listing deleted" });
  } catch (error) {
    console.error("DELETE /api/listings/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete listing" },
      { status: 500 }
    );
  }
}
