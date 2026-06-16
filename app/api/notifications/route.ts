import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/lib/models/Notification";

// GET /api/notifications
export async function GET() {
  try {
    await connectDB();
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications — mark all as read
export async function PATCH() {
  try {
    await connectDB();
    await Notification.updateMany({ read: false }, { read: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/notifications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
