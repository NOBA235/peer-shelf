import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Mentor from "@/lib/models/Mentor";

// GET /api/mentors
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    const location = searchParams.get("location");
    const search = searchParams.get("search");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    if (subject && subject !== "All") query.subject = subject;
    if (location && location !== "All Locations")
      query.location = { $regex: location, $options: "i" };
    if (search) query.$text = { $search: search };

    const mentors = await Mentor.find(query)
      .sort({ rating: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ success: true, data: mentors });
  } catch (error) {
    console.error("GET /api/mentors error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch mentors" },
      { status: 500 }
    );
  }
}

// POST /api/mentors
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const mentor = await Mentor.create(body);
    return NextResponse.json({ success: true, data: mentor }, { status: 201 });
  } catch (error) {
    console.error("POST /api/mentors error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create mentor" },
      { status: 500 }
    );
  }
}
