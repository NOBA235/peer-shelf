"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import ScannerModal from "@/components/ScannerModal";
import WishlistModal from "@/components/WishlistModal";
import ResourceModal from "@/components/ResourceModal";
import MentorModal from "@/components/MentorModal";
import HomeSection from "@/components/sections/HomeSection";
import MarketplaceSection from "@/components/sections/MarketplaceSection";
import ScanSection from "@/components/sections/ScanSection";
import WishlistSection from "@/components/sections/WishlistSection";
import MentorsSection from "@/components/sections/MentorsSection";
import DashboardSection from "@/components/sections/DashboardSection";
import { Listing, Mentor } from "@/lib/data";

const DESKTOP_NAV = [
  { id: "home", label: "Home" },
  { id: "marketplace", label: "Marketplace" },
  { id: "scan", label: "Scan" },
  { id: "wishlist", label: "Wishlist" },
  { id: "mentors", label: "Mentors" },
  { id: "dashboard", label: "Dashboard" },
];

export default function Page() {
  const [tab, setTab] = useState("home");
  const [showScanner, setShowScanner] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [selListing, setSelListing] = useState<Listing | null>(null);
  const [selMentor, setSelMentor] = useState<Mentor | null>(null);

  const goTab = (t: string) => {
    setTab(t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">

      {/* Navbar — full width */}
      <Navbar onScan={() => setShowScanner(true)} />

      {/* Desktop: sidebar nav + content */}
      <div className="container-app flex min-h-[calc(100vh-56px)]">

        {/* Sidebar — desktop only */}
        <aside className="hidden lg:flex w-52 flex-shrink-0 flex-col border-r border-[#E4E4E7] bg-white py-8 pr-6 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
          <nav className="space-y-1">
            {DESKTOP_NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => goTab(item.id)}
                className={`w-full rounded-md px-3 py-2.5 text-left text-sm font-medium transition ${
                  tab === item.id
                    ? "bg-[#F4F4F5] text-[#18181B]"
                    : "text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Sidebar CTA */}
          <div className="mt-auto pt-8">
            <div className="rounded-md border border-[#E4E4E7] bg-white p-4 space-y-3">
              <p className="text-sm font-semibold text-[#18181B]">Have books to share?</p>
              <p className="text-xs text-[#71717A]">Scan &amp; list in 30 seconds</p>
              <button
                onClick={() => setShowScanner(true)}
                className="w-full justify-center rounded-md bg-[#18181B] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#27272A] focus:outline-none focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2"
              >
                📷 Scan Now
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 pb-24 lg:pb-12 lg:pl-4">
          <div key={tab} className="animate-fade-up">
            {tab === "home" && (
              <HomeSection
                onTabChange={goTab}
                onListingClick={setSelListing}
                onMentorClick={setSelMentor}
                onScan={() => setShowScanner(true)}
                onWishlist={() => setShowWishlist(true)}
              />
            )}
            {tab === "marketplace" && (
              <MarketplaceSection
                onListingClick={setSelListing}
                onRequest={() => setShowWishlist(true)}
              />
            )}
            {tab === "scan" && (
              <ScanSection onOpenScanner={() => setShowScanner(true)} />
            )}
            {tab === "wishlist" && (
              <WishlistSection onRequest={() => setShowWishlist(true)} />
            )}
            {tab === "mentors" && (
              <MentorsSection onMentorClick={setSelMentor} />
            )}
            {tab === "dashboard" && <DashboardSection />}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav active={tab} onChange={goTab} />

      {/* Modals */}
      {showScanner && <ScannerModal onClose={() => setShowScanner(false)} />}
      {showWishlist && <WishlistModal onClose={() => setShowWishlist(false)} />}
      {selListing && (
        <ResourceModal listing={selListing} onClose={() => setSelListing(null)} />
      )}
      {selMentor && (
        <MentorModal mentor={selMentor} onClose={() => setSelMentor(null)} />
      )}
    </div>
  );
}