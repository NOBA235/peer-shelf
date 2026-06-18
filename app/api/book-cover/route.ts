import { NextRequest, NextResponse } from "next/server";
import { fetchBookCover } from "@/lib/bookCover";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? undefined;
  const isbn  = searchParams.get("isbn")  ?? undefined;
  if (!title && !isbn) return NextResponse.json({ success: false, error: "Provide title or isbn" }, { status: 400 });
  const url = await fetchBookCover({ title, isbn });
  return NextResponse.json({ success: true, url });
}