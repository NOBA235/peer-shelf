import { NextRequest, NextResponse } from "next/server";

// ── Types ──────────────────────────────────────────────────
interface VisionTextAnnotation {
  description: string;
}
interface VisionResponse {
  responses: Array<{
    textAnnotations?: VisionTextAnnotation[];
    fullTextAnnotation?: { text: string };
    error?: { message: string };
  }>;
}

interface OpenLibraryBook {
  title?: string;
  authors?: Array<{ name: string }>;
  publishers?: string[];
  number_of_pages?: number;
  publish_date?: string;
  subjects?: string[];
}

export interface ScanResult {
  rawText: string;
  isbn: string | null;
  title: string | null;
  author: string | null;
  edition: string | null;
  publisher: string | null;
  subjects: string[];
  source: "google-vision" | "open-library" | "combined";
}

// ── ISBN extraction ────────────────────────────────────────
// Matches ISBN-10 and ISBN-13, with or without hyphens
function extractISBN(text: string): string | null {
  const cleaned = text.replace(/[\s-]/g, "");
  // ISBN-13: starts with 978 or 979, 13 digits total
  const isbn13 = cleaned.match(/(?:97[89])\d{10}/);
  if (isbn13) return isbn13[0];
  // ISBN-10: 10 chars, last can be X
  const isbn10 = cleaned.match(/\b\d{9}[\dXx]\b/);
  if (isbn10) return isbn10[0].toUpperCase();
  return null;
}

// Try to guess title/author from raw OCR lines (heuristic, used as fallback)
function guessTitleAuthor(rawText: string): { title: string | null; author: string | null } {
  const lines = rawText
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 2 && !/^\d+$/.test(l));

  if (lines.length === 0) return { title: null, author: null };

  // Heuristic: longest line near the top is usually the title
  const topLines = lines.slice(0, 6);
  const title = topLines.sort((a, b) => b.length - a.length)[0] ?? null;

  // Heuristic: a line containing common author indicators
  const authorLine = lines.find(l =>
    /^(by|author[s]?:?)\s+/i.test(l) || /^[A-Z][a-z]+(\s[A-Z][.\s]?)+[A-Z][a-z]+$/.test(l)
  );
  const author = authorLine
    ? authorLine.replace(/^(by|author[s]?:?)\s+/i, "").trim()
    : null;

  return { title, author };
}

// ── Google Cloud Vision OCR ───────────────────────────────────
async function runVisionOCR(base64Image: string): Promise<string> {
  const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_CLOUD_VISION_API_KEY is not configured");

  const res = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: "TEXT_DETECTION" }],
          },
        ],
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Vision API error (${res.status}): ${errText}`);
  }

  const data: VisionResponse = await res.json();
  const result = data.responses?.[0];

  if (result?.error) throw new Error(`Vision API error: ${result.error.message}`);

  return result?.fullTextAnnotation?.text
    ?? result?.textAnnotations?.[0]?.description
    ?? "";
}

// ── Open Library metadata lookup ─────────────────────────────
async function lookupOpenLibrary(isbn: string): Promise<OpenLibraryBook | null> {
  try {
    const res = await fetch(`https://openlibrary.org/isbn/${isbn}.json`, {
      headers: { "User-Agent": "PeerAndShelf/1.0" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Open Library author records need a follow-up fetch
async function lookupAuthorNames(authorRefs?: Array<{ key: string }>): Promise<string[]> {
  if (!authorRefs || authorRefs.length === 0) return [];
  const names = await Promise.all(
    authorRefs.slice(0, 2).map(async ref => {
      try {
        const res = await fetch(`https://openlibrary.org${ref.key}.json`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.name as string | undefined ?? null;
      } catch {
        return null;
      }
    })
  );
  return names.filter((n): n is string => !!n);
}

// ── Route handler ──────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image } = body as { image?: string };

    if (!image) {
      return NextResponse.json(
        { success: false, error: "No image provided. Send base64-encoded image as 'image'." },
        { status: 400 }
      );
    }

    // Strip data URL prefix if present (data:image/jpeg;base64,...)
    const base64 = image.replace(/^data:image\/\w+;base64,/, "");

    // 1. Run OCR via Google Cloud Vision
    let rawText: string;
    try {
      rawText = await runVisionOCR(base64);
    } catch (err) {
      return NextResponse.json(
        { success: false, error: err instanceof Error ? err.message : "OCR failed" },
        { status: 502 }
      );
    }

    if (!rawText.trim()) {
      return NextResponse.json(
        { success: false, error: "No text detected in image. Try a clearer photo of the cover or ISBN barcode area." },
        { status: 422 }
      );
    }

    // 2. Extract ISBN from OCR text
    const isbn = extractISBN(rawText);

    // 3. If ISBN found, look up real metadata via Open Library
    let title: string | null = null;
    let author: string | null = null;
    let edition: string | null = null;
    let publisher: string | null = null;
    let subjects: string[] = [];
    let source: ScanResult["source"] = "google-vision";

    if (isbn) {
      const book = await lookupOpenLibrary(isbn);
      if (book) {
        title = book.title ?? null;
        publisher = book.publishers?.[0] ?? null;
        edition = book.publish_date ?? null;
        subjects = book.subjects?.slice(0, 5) ?? [];

        // Open Library /isbn/ endpoint returns author *references*, not names
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const authorRefs = (book as any).authors as Array<{ key: string }> | undefined;
        const authorNames = await lookupAuthorNames(authorRefs);
        author = authorNames.join(", ") || null;

        source = "combined";
      }
    }

    // 4. Fallback heuristics from raw OCR if Open Library had no match
    if (!title || !author) {
      const guess = guessTitleAuthor(rawText);
      title = title ?? guess.title;
      author = author ?? guess.author;
      if (source === "google-vision") source = "google-vision";
    }

    const result: ScanResult = { rawText, isbn, title, author, edition, publisher, subjects, source };

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("POST /api/scan error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Scan failed" },
      { status: 500 }
    );
  }
}
