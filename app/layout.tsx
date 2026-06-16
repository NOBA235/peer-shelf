import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peer & Shelf — Student Resource Network",
  description:
    "Buy, sell, exchange, and donate textbooks. Find mentors. Share notes. All within your student community.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
