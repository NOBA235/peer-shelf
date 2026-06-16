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

/* ── Desktop Navigation Dropdown ─────────────────────────── */
function DesktopNavDropdown({
  active,
  onSelect,
  onScan,
}: {
  active: string;
  onSelect: (id: string) => void;
  onScan: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative hidden lg:block">
      <button
        onClick={() => setOpen(!open)}
        className="btn-ghost btn-sm flex items-center gap-2"
      >
        Menu
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <>
          {/* Overlay to close on outside click */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-56 glass animate-in duration-300">
            <nav className="py-2">
              {DESKTOP_NAV.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item.id);
                    setOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm font-medium transition ${
                    active === item.id
                      ? "bg-white/[0.06] text-[#a78bfa]"
                      : "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="border-t border-white/[0.08] px-4 py-3">
              <p className="caption mb-2">Have books to share?</p>
              <button
                onClick={() => {
                  onScan();
                  setOpen(false);
                }}
                className="btn-primary btn-sm w-full justify-center"
              >
                📷 Scan Now
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────── */
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
    <div className="min-h-screen bg-primary">
      {/* Navbar + Dropdown trigger */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-primary/80 backdrop-blur-md sticky top-0 z-30">
        <Navbar onScan={() => setShowScanner(true)} />
        <DesktopNavDropdown
          active={tab}
          onSelect={goTab}
          onScan={() => setShowScanner(true)}
        />
      </header>

      {/* Main content – no sidebar, full width */}
      <main className="container-app section-pad pb-24 lg:pb-12">
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

      {/* Mobile bottom nav (unchanged) */}
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