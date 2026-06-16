import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/lib/models/Listing";
import Mentor from "@/lib/models/Mentor";
import WishlistItem from "@/lib/models/WishlistItem";
import Notification from "@/lib/models/Notification";

const SEED_LISTINGS = [
  {
    title: "H.C. Verma — Concepts of Physics Vol 1 & 2",
    author: "H.C. Verma", subject: "Physics", curriculum: "CBSE / JEE",
    board: "CBSE", grade: "Class 11–12", price: 380, originalPrice: 840,
    condition: "Good", location: "Lajpat Nagar, Delhi", city: "Delhi",
    notes: true, mentor: true, donated: false, exchange: false,
    image: "📗", color: "#16a34a", seller: "Aditi S.", sellerInitials: "AS",
    rating: 4.9, saves: 34, type: "Textbook",
    description: "Both volumes in good condition. Minor pencil marks in Vol 1 chapters 12–15. Includes handwritten notes on all mechanics chapters.",
    included: ["Handwritten mechanics notes", "Solved exercise booklet", "Formula quick-reference card"],
    meetupPoint: "Lajpat Nagar Metro Station Exit 2", listedDaysAgo: 2,
  },
  {
    title: "NCERT Chemistry Class 12 — Full Set",
    author: "NCERT", subject: "Chemistry", curriculum: "CBSE",
    board: "CBSE", grade: "Class 12", price: 0, originalPrice: 320,
    condition: "Like New", location: "Bandra West, Mumbai", city: "Mumbai",
    notes: true, mentor: false, donated: true, exchange: false,
    image: "📘", color: "#2563eb", seller: "Rohan M.", sellerInitials: "RM",
    rating: 4.8, saves: 19, type: "Textbook",
    description: "Donating my NCERT Chemistry set. No marks anywhere. Comes with chapter-wise reaction notes.",
    included: ["Chapter-wise reaction notes", "NCERT exemplar solutions PDF"],
    meetupPoint: "Bandra Station, platform side", listedDaysAgo: 5,
  },
  {
    title: "T.S. Grewal Accountancy Part 1 + Part 2",
    author: "T.S. Grewal", subject: "Accountancy", curriculum: "CBSE",
    board: "CBSE", grade: "Class 12", price: 260, originalPrice: 580,
    condition: "Very Good", location: "Koramangala, Bengaluru", city: "Bengaluru",
    notes: true, mentor: true, donated: false, exchange: true,
    image: "📙", color: "#d97706", seller: "Priya N.", sellerInitials: "PN",
    rating: 4.7, saves: 28, type: "Textbook",
    description: "Both parts in very good condition. Highlighted key questions. Extra solved examples booklet included.",
    included: ["Highlighted key questions", "Extra solved examples booklet", "Partnership formula sheet"],
    meetupPoint: "Koramangala 4th Block BDA Complex", listedDaysAgo: 8,
  },
  {
    title: "R.D. Sharma Mathematics Class 12",
    author: "R.D. Sharma", subject: "Mathematics", curriculum: "CBSE / JEE",
    board: "CBSE", grade: "Class 12", price: 420, originalPrice: 895,
    condition: "Good", location: "Kothrud, Pune", city: "Pune",
    notes: false, mentor: true, donated: false, exchange: false,
    image: "📕", color: "#dc2626", seller: "Arjun S.", sellerInitials: "AJ",
    rating: 5.0, saves: 51, type: "Textbook",
    description: "RD Sharma Class 12 in good condition. Some chapters have bookmarks. All pages intact.",
    included: ["Chapter bookmarks", "Important question sticky notes"],
    meetupPoint: "Kothrud Depot Bus Stand", listedDaysAgo: 1,
  },
  {
    title: "Trueman's Elementary Biology Vol 1 & 2",
    author: "Trueman", subject: "Biology", curriculum: "NEET / CBSE",
    board: "CBSE", grade: "Class 11–12", price: 340, originalPrice: 760,
    condition: "Good", location: "Andheri East, Mumbai", city: "Mumbai",
    notes: true, mentor: false, donated: false, exchange: true,
    image: "📗", color: "#16a34a", seller: "Meera K.", sellerInitials: "MK",
    rating: 4.6, saves: 22, type: "Textbook",
    description: "Both volumes in good shape. Color-coded chapter highlights.",
    included: ["Color-coded chapter notes", "Taxonomy quick-reference chart"],
    meetupPoint: "Andheri East Metro Station", listedDaysAgo: 3,
  },
  {
    title: "D.C. Pandey — Optics & Modern Physics",
    author: "D.C. Pandey", subject: "Physics", curriculum: "JEE",
    board: "CBSE", grade: "Class 12", price: 290, originalPrice: 520,
    condition: "Fair", location: "Rajouri Garden, Delhi", city: "Delhi",
    notes: true, mentor: false, donated: false, exchange: false,
    image: "📘", color: "#2563eb", seller: "Vikram T.", sellerInitials: "VT",
    rating: 4.5, saves: 14, type: "Textbook",
    description: "Fair condition — spine slightly bent but all pages complete. JEE PYQ marked.",
    included: ["JEE PYQ solved markers", "Handwritten optics formula sheet"],
    meetupPoint: "Rajouri Garden Metro Station", listedDaysAgo: 12,
  },
  {
    title: "Organic Chemistry Notes — Class 12 CBSE",
    author: "Sneha I.", subject: "Chemistry", curriculum: "CBSE",
    board: "CBSE", grade: "Class 12", price: 80, originalPrice: 80,
    condition: "Like New", location: "Powai, Mumbai", city: "Mumbai",
    notes: true, mentor: true, donated: false, exchange: false,
    image: "📝", color: "#7c3aed", seller: "Sneha I.", sellerInitials: "SI",
    rating: 4.9, saves: 41, type: "Notes",
    description: "Complete handwritten notes for all Organic Chemistry chapters. Used for 98-score in boards.",
    included: ["Full chapter notes", "Named reactions list", "Mechanism diagrams"],
    meetupPoint: "Powai IIT Gate", listedDaysAgo: 6,
  },
  {
    title: "Mathematics Formula Sheet — JEE Mains",
    author: "Arjun S.", subject: "Mathematics", curriculum: "JEE",
    board: "CBSE", grade: "Class 12", price: 50, originalPrice: 50,
    condition: "Like New", location: "Kothrud, Pune", city: "Pune",
    notes: true, mentor: true, donated: false, exchange: false,
    image: "📋", color: "#7c3aed", seller: "Arjun S.", sellerInitials: "AJ",
    rating: 5.0, saves: 67, type: "Formula Sheet",
    description: "12-page laminated formula sheet covering all JEE Maths topics.",
    included: ["12-page laminated sheet", "Digital PDF version"],
    meetupPoint: "Kothrud Depot Bus Stand", listedDaysAgo: 4,
  },
];

const SEED_MENTORS = [
  {
    name: "Aditi Sharma", initials: "AS", grade: "98.4% CBSE",
    achievement: "JEE Advanced AIR 142", subject: "Physics",
    rating: 4.9, reviews: 47, location: "Lajpat Nagar, Delhi",
    books: ["H.C. Verma Concepts of Physics", "D.C. Pandey Mechanics", "NCERT Physics"],
    bio: "Scored 97 in Physics boards and qualified JEE Advanced with AIR 142. Happy to share strategies, notes, and book recommendations.",
    sessions: 84, notesShared: 31, studentsHelped: 120,
    subjects: ["Mechanics", "Electrodynamics", "Optics", "Modern Physics"],
    board: "CBSE", quote: "Used H.C. Verma cover-to-cover. Every solved example is gold.",
  },
  {
    name: "Rohan Mehta", initials: "RM", grade: "97.2% ICSE",
    achievement: "NEET 2024 — 680/720", subject: "Biology",
    rating: 4.8, reviews: 38, location: "Bandra West, Mumbai",
    books: ["NCERT Biology Class 11 & 12", "Trueman's Elementary Biology", "MTG NEET Guide"],
    bio: "Cleared NEET with 680/720 in first attempt. Complete notes for Genetics, Human Physiology, and Plant Biology.",
    sessions: 62, notesShared: 44, studentsHelped: 93,
    subjects: ["Genetics", "Physiology", "Ecology", "Cell Biology"],
    board: "ICSE", quote: "Read NCERT 5 times. Then read it again.",
  },
  {
    name: "Priya Nair", initials: "PN", grade: "96.8% CBSE",
    achievement: "CA Foundation — First Attempt", subject: "Accountancy",
    rating: 4.7, reviews: 29, location: "Koramangala, Bengaluru",
    books: ["T.S. Grewal Accountancy", "NCERT Accountancy", "DK Goel"],
    bio: "Cleared CA Foundation in first attempt while scoring 96.8 in boards.",
    sessions: 41, notesShared: 28, studentsHelped: 67,
    subjects: ["Financial Statements", "Partnership Accounts", "Cash Flow", "Ratio Analysis"],
    board: "CBSE", quote: "T.S. Grewal has every type of question you'll ever see.",
  },
  {
    name: "Arjun Singh", initials: "AJ", grade: "99.2% CBSE",
    achievement: "KVPY SB Fellow 2024", subject: "Mathematics",
    rating: 5.0, reviews: 61, location: "Kothrud, Pune",
    books: ["R.D. Sharma Class 12", "S.L. Loney Trigonometry", "Arihant Calculus"],
    bio: "KVPY Fellow and JEE aspirant with a 99.2 in boards. Can help with both board exam scoring and competitive exam depth.",
    sessions: 107, notesShared: 52, studentsHelped: 188,
    subjects: ["Calculus", "Algebra", "Probability", "3D Geometry"],
    board: "CBSE", quote: "Solve 100 problems, not 1 problem 100 times.",
  },
  {
    name: "Sneha Iyer", initials: "SI", grade: "97.6% CBSE",
    achievement: "IIT Bombay CSE 2024", subject: "Chemistry",
    rating: 4.9, reviews: 33, location: "Powai, Mumbai",
    books: ["NCERT Chemistry", "O.P. Tandon Physical Chemistry", "J.D. Lee Inorganic"],
    bio: "IIT Bombay CSE undergrad. Organic Chemistry was my strongest — scored 98 in boards.",
    sessions: 55, notesShared: 39, studentsHelped: 78,
    subjects: ["Organic Chemistry", "Physical Chemistry", "Inorganic Chemistry", "Electrochemistry"],
    board: "CBSE", quote: "Mechanisms first, reactions follow. Never memorise blindly.",
  },
  {
    name: "Karan Malhotra", initials: "KM", grade: "95.4% CBSE",
    achievement: "NDA Written Qualified", subject: "Mathematics",
    rating: 4.6, reviews: 19, location: "Sector 15, Chandigarh",
    books: ["R.S. Aggarwal", "NCERT Maths", "Cengage Trigonometry"],
    bio: "Qualified NDA Written and scored 95+ in boards. Specialise in Trigonometry and Vectors.",
    sessions: 28, notesShared: 18, studentsHelped: 44,
    subjects: ["Trigonometry", "Vectors", "Statistics", "Linear Programming"],
    board: "CBSE", quote: "Every theorem has an intuition. Find it first.",
  },
];

const SEED_NOTIFICATIONS = [
  { type: "match", text: "Match found! Sana Khan has O.P. Tandon Physical Chemistry — 1.2km away", time: "2m ago", read: false },
  { type: "mentor", text: "Rohan Mehta accepted your Biology mentorship request", time: "1h ago", read: false },
  { type: "save", text: "Your H.C. Verma listing was saved by 3 new students today", time: "3h ago", read: true },
  { type: "review", text: "Priya rated your exchange ★★★★★ — 'Excellent condition, fast meetup!'", time: "1d ago", read: true },
  { type: "system", text: "Welcome to Peer & Shelf! Complete your profile to get better matches.", time: "3d ago", read: true },
];

const SEED_WISHLIST = [
  { title: "Physical Chemistry — O.P. Tandon", subject: "Chemistry", curriculum: "NEET", grade: "Class 12", status: "match", matchName: "Sana Khan", matchDistance: "1.2 km", addedDaysAgo: 3 },
  { title: "S.L. Arora Physics New Simplified Class 11", subject: "Physics", curriculum: "CBSE", grade: "Class 11", status: "searching", addedDaysAgo: 7 },
  { title: "D.K. Goel Accountancy Vol 2", subject: "Accountancy", curriculum: "CBSE", grade: "Class 12", status: "potential", matchCount: 2, addedDaysAgo: 1 },
];

export async function GET() {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      Listing.deleteMany({}),
      Mentor.deleteMany({}),
      WishlistItem.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    // Seed fresh data
    await Promise.all([
      Listing.insertMany(SEED_LISTINGS),
      Mentor.insertMany(SEED_MENTORS),
      WishlistItem.insertMany(SEED_WISHLIST),
      Notification.insertMany(SEED_NOTIFICATIONS),
    ]);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      counts: {
        listings: SEED_LISTINGS.length,
        mentors: SEED_MENTORS.length,
        wishlist: SEED_WISHLIST.length,
        notifications: SEED_NOTIFICATIONS.length,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: "Seeding failed" },
      { status: 500 }
    );
  }
}
