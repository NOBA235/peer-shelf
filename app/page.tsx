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

export default function Page() {
  const [tab, setTab]                 = useState("home");
  const [showScanner, setShowScanner] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [selListing, setSelListing]   = useState<Listing | null>(null);
  const [selMentor, setSelMentor]     = useState<Mentor | null>(null);

  const goTab = (t: string) => {
    setTab(t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">

      {/* Navbar — all three required props supplied */}
      <Navbar
        onScan={() => setShowScanner(true)}
        activeTab={tab}
        onTabChange={goTab}
      />

      {/* Shell: sidebar + content */}
      <div className="flex min-h-[calc(100vh-56px)]">

        {/* Main content — flex-1, sections own their own padding */}
        <main className="flex-1 min-w-0 pb-24 lg:pb-12">
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
            {tab === "scan"      && <ScanSection onOpenScanner={() => setShowScanner(true)} />}
            {tab === "wishlist"  && <WishlistSection onRequest={() => setShowWishlist(true)} />}
            {tab === "mentors"   && <MentorsSection onMentorClick={setSelMentor} />}
            {tab === "dashboard" && <DashboardSection />}
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