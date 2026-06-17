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
    <>
      {/* Scoped styles for responsive grid and padding */}
      <style>{`
        .mentors-container {
          padding: 2rem 1.25rem;
          max-width: 80rem;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2.25rem;
        }
        .search-row {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: stretch;
        }
        .grid-cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 640px) {
          .mentors-container {
            padding: 3rem 1.5rem;
            gap: 2.5rem;
          }
          .search-row {
            flex-direction: row;
            align-items: center;
          }
          .search-row > :first-child {
            flex: 1;
          }
        }
        @media (min-width: 1024px) {
          .mentors-container {
            padding: 3rem 2rem;
          }
          .grid-cards {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div style={{ minHeight: "100vh", backgroundColor: "#FAFAFA", color: "#18181B" }}>
        <div className="mentors-container">
          {/* Header */}
          <div style={{ marginBottom: "-0.5rem" }}>
            <SectionLabel>Mentorship Hub</SectionLabel>
            <h1 style={{ marginTop: "0.25rem", fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.2 }}>
              Find a Mentor
            </h1>
            <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "#52525B" }}>
              Learn from students who&apos;ve scored top marks
            </p>
          </div>

          {/* Search + location row */}
          <div className="search-row">
            {/* Search input */}
            <div style={{ position: "relative", flex: 1 }}>
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#71717A",
                }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or subject…"
                style={{
                  width: "100%",
                  borderRadius: "0.5rem",
                  border: "1px solid #E4E4E7",
                  backgroundColor: "white",
                  padding: "0.625rem 0.75rem 0.625rem 2.5rem",
                  fontSize: "0.875rem",
                  color: "#18181B",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#18181B";
                  e.target.style.boxShadow = "0 0 0 2px rgba(24,24,27,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E4E4E7";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Location select */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <MapPin
                size={16}
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#71717A",
                }}
              />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: "100%",
                  borderRadius: "0.5rem",
                  border: "1px solid #E4E4E7",
                  backgroundColor: "white",
                  padding: "0.625rem 2rem 0.625rem 2.25rem",
                  fontSize: "0.875rem",
                  color: "#18181B",
                  appearance: "none",
                  outline: "none",
                  backgroundImage:
                    "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%2371717A\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"/></svg>')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.5rem center",
                  backgroundSize: "1rem",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#18181B";
                  e.target.style.boxShadow = "0 0 0 2px rgba(24,24,27,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E4E4E7";
                  e.target.style.boxShadow = "none";
                }}
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
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              overflowX: "auto",
              paddingBottom: "0.5rem",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              marginTop: "-0.25rem", // compensate for the container gap, keep it tight but still separated
            }}
          >
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

          <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#52525B", marginTop: "-0.5rem" }}>
            {visible.length} mentor{visible.length !== 1 ? "s" : ""} available
          </p>

          {/* Results */}
          {loading ? (
            <div className="grid-cards">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} style={{ height: "12rem", borderRadius: "0.75rem" }} />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <EmptyState
              icon={<GraduationCap size={32} style={{ color: "#A1A1AA" }} />}
              title="No mentors found"
              desc="Try adjusting your search or filters"
            />
          ) : (
            <div className="grid-cards">
              {visible.map((m) => (
                <MentorCard key={m._id} mentor={toMentor(m)} onClick={onMentorClick} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}