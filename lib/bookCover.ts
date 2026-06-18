export async function fetchBookCover(
  query: { title?: string; isbn?: string }
): Promise<string | null> {
  try {
    const q = query.isbn
      ? `isbn:${query.isbn}`
      : `intitle:${encodeURIComponent(query.title ?? "")}`;

    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1&fields=items(volumeInfo(imageLinks))`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;

    const data = await res.json();
    const imageLinks = data?.items?.[0]?.volumeInfo?.imageLinks;
    const url =
      imageLinks?.large ?? imageLinks?.medium ?? imageLinks?.small ??
      imageLinks?.thumbnail ?? imageLinks?.smallThumbnail ?? null;

    return url ? url.replace("http://", "https://") : null;
  } catch {
    return null;
  }
}