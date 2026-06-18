import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Mentor from "@/lib/models/Mentor";
import User from "@/lib/models/User";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ success: false, error: "Sign in required" }, { status: 401 });
  if (session.user.isMentor) return NextResponse.json({ success: false, error: "Already a mentor" }, { status: 400 });

  try {
    await connectDB();
    const body = await req.json();
    const { grade, achievement, subject, subjects, board, location, bio, quote, books } = body;
    if (!grade || !achievement || !subject || !location || !bio)
      return NextResponse.json({ success: false, error: "grade, achievement, subject, location and bio are required" }, { status: 400 });

    const name     = session.user.name ?? "Anonymous";
    const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

    const mentor = await Mentor.create({
      userId: session.user.id, name, initials,
      email: session.user.email ?? undefined,
      image: session.user.image ?? undefined,
      grade, achievement, subject, board, location, bio,
      quote: quote ?? "",
      books: books ?? [],
      subjects: subjects?.length ? subjects : [subject],
      rating: 5.0, reviews: 0, sessions: 0, notesShared: 0, studentsHelped: 0,
    });

    await User.findOneAndUpdate(
      { email: session.user.email },
      { isMentor: true, mentorProfileId: mentor._id }
    );

    return NextResponse.json({ success: true, data: mentor }, { status: 201 });
  } catch (error) {
    console.error("mentor-register error:", error);
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 });
  }
}