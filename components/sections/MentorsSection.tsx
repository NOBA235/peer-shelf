"use client";
import { useState, useEffect } from "react";
import { fetchMentors, MentorDoc } from "@/lib/api";
import { Mentor } from "@/lib/data";
import MentorCard from "../MentorCard";
import { Chip, Skeleton, EmptyState, SectionLabel } from "../ui";
import { Search, MapPin, GraduationCap } from "lucide-react";

function toMentor(d: MentorDoc): Mentor {
  return { ...d, id: d._id } as unknown as Mentor;
}

interface Props {
  onMentorClick: (m: Mentor) => void;
}

const SUBJECTS = ["All", "Physics", "Chemistry", "Biology", "Mathematics", "Accountancy"];
const LOCATIONS = ["All Locations", "Delhi", "Mumbai", "Bengaluru", "Pune", "Chandigarh"];

export default function MentorsSection({ onMentorClick }: Props) {
  const [mentors, setMentors] = useState<MentorDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [location, setLocation] = useState("All Locations");

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchMentors({
        subject: subject !== "All" ? subject : undefined,
        location: location !== "All Locations" ? location : undefined,
      });
      setMentors(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [subject, location]);

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        setMentors(await fetchMentors({ search: search || undefined }));
      } catch {
        /* ignore */
      }
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const visible = mentors.filter(
    (m) =>
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-12 text-[#18181B] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <SectionLabel>Mentorship Hub</SectionLabel>
          <h1 className="text-3xl font-bold tracking-tight text-[#18181B] sm:text-4xl">
            Find a Mentor
          </h1>
          <p className="mt-1 text-sm text-[#52525B]">
            Learn from students who&apos;ve scored top marks
          </p>
        </div>

        {/* Search + location */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or subject…"
              className="w-full rounded-lg border border-[#E4E4E7] bg-white py-2.5 pl-10 pr-4 text-[#18181B] placeholder:text-[#71717A] focus:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B]/10"
            />
          </div>
          <div className="relative flex-shrink-0">
            <MapPin
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]"
            />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-[#E4E4E7] bg-white py-2.5 pl-9 pr-8 text-sm text-[#18181B] appearance-none focus:border-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#18181B]/10"
            >
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subject chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {SUBJECTS.map((s) => (
            <Chip
              key={s}
              active={subject === s}
              onClick={() => setSubject(s)}
              className="whitespace-nowrap"
            >
              {s}
            </Chip>
          ))}
        </div>

        <p className="text-sm font-medium text-[#52525B]">
          {visible.length} mentor{visible.length !== 1 ? "s" : ""} available
        </p>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<GraduationCap size={32} className="text-[#A1A1AA]" />}
            title="No mentors found"
            desc="Try adjusting your search or filters"
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {visible.map((m) => (
              <MentorCard key={m._id} mentor={toMentor(m)} onClick={onMentorClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}