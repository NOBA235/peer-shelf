import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Mentor from "@/lib/models/Mentor";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const mentor = await Mentor.findById(id).lean();

    if (!mentor) {
      return NextResponse.json(
        { success: false, error: "Mentor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: mentor });
  } catch (error) {
    console.error("GET /api/mentors/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch mentor" },
      { status: 500 }
    );
  }
}
