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
  { id: "home",        label: "Home"       },
  { id: "marketplace", label: "Marketplace"},
  { id: "scan",        label: "Scan"       },
  { id: "wishlist",    label: "Wishlist"   },
  { id: "mentors",     label: "Mentors"    },
  { id: "dashboard",   label: "Dashboard"  },
];

export default function Page() {
  const [tab, setTab] = useState("home");
  const [showScanner,  setShowScanner]  = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [selListing,   setSelListing]   = useState<Listing | null>(null);
  const [selMentor,    setSelMentor]    = useState<Mentor | null>(null);

  const goTab = (t: string) => {
    setTab(t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-48 left-1/3 w-[600px] h-[600px] bg-violet-700/6 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-violet-800/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-900/5 rounded-full blur-[100px]" />
      </div>

      {/* Navbar — full width */}
      <Navbar onScan={() => setShowScanner(true)} />

      {/* Desktop: sidebar nav + content */}
      <div className="container-app flex min-h-[calc(100vh-56px)]">

        {/* Sidebar — desktop only */}
        <aside className="hidden lg:flex flex-col w-52 flex-shrink-0 py-8 pr-6 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
          <nav className="space-y-1">
            {DESKTOP_NAV.map(item => (
              <button
                key={item.id}
                onClick={() => goTab(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  tab === item.id
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Sidebar CTA */}
          <div className="mt-auto pt-8">
            <div className="glass p-4 space-y-3 rounded-xl">
              <p className="text-white font-semibold text-sm">Have books to share?</p>
              <p className="caption">Scan &amp; list in 30 seconds</p>
              <button
                onClick={() => setShowScanner(true)}
                className="btn-primary btn-sm w-full justify-center"
              >
                📷 Scan Now
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 pb-24 lg:pb-12 lg:pl-4">
          {/* Page content with animation */}
          <div key={tab} className="animate-fade-up">
            {tab === "home"        && <HomeSection onTabChange={goTab} onListingClick={setSelListing} onMentorClick={setSelMentor} onScan={() => setShowScanner(true)} onWishlist={() => setShowWishlist(true)} />}
            {tab === "marketplace" && <MarketplaceSection onListingClick={setSelListing} onRequest={() => setShowWishlist(true)} />}
            {tab === "scan"        && <ScanSection onOpenScanner={() => setShowScanner(true)} />}
            {tab === "wishlist"    && <WishlistSection onRequest={() => setShowWishlist(true)} />}
            {tab === "mentors"     && <MentorsSection onMentorClick={setSelMentor} />}
            {tab === "dashboard"   && <DashboardSection />}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav active={tab} onChange={goTab} />

      {/* Modals */}
      {showScanner  && <ScannerModal  onClose={() => setShowScanner(false)} />}
      {showWishlist && <WishlistModal onClose={() => setShowWishlist(false)} />}
      {selListing   && <ResourceModal listing={selListing} onClose={() => setSelListing(null)} />}
      {selMentor    && <MentorModal   mentor={selMentor}   onClose={() => setSelMentor(null)} />}
    </div>
  );
}
