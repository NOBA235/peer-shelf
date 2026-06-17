"use client";
import { useState, useRef } from "react";
import {
  Camera,
  Upload,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  MapPin,
  BookOpen,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { scanBookImage, createListing, ScanResult } from "@/lib/api";

interface Props {
  onClose: () => void;
  onList?: () => void;
}

type Stage = "idle" | "scanning" | "result" | "error" | "listing" | "done";

export default function ScannerModal({ onClose, onList }: Props) {
  const [stage, setStage] = useState<Stage>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  // Editable fields
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [price, setPrice] = useState("0");
  const [condition, setCondition] = useState("Good");
  const [meetup, setMeetup] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    setStage("scanning");

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      const base64 = dataUrl.split(",")[1];

      try {
        const data = await scanBookImage(base64);
        setResult(data);
        setTitle(data.title ?? "");
        setAuthor(data.author ?? "");
        setSubject(data.subjects?.[0] ?? "");
        setStage("result");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Scan failed. Please try again."
        );
        setStage("error");
      }
    };
    reader.onerror = () => {
      setError("Could not read the selected file.");
      setStage("error");
    };
    reader.readAsDataURL(file);
  };

  const onFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const publish = async () => {
    setStage("listing");
    try {
      await createListing({
        title: title || "Untitled Book",
        author: author || "Unknown",
        subject: subject || "General",
        curriculum: "CBSE",
        board: "CBSE",
        grade: "Class 12",
        price: Number(price) || 0,
        originalPrice: Number(price) || 0,
        condition: condition as "Like New" | "Very Good" | "Good" | "Fair",
        location: meetup || "Not specified",
        city: "Unspecified",
        notes: false,
        mentor: false,
        donated: Number(price) === 0,
        exchange: false,
        image: "📚",
        color: "#7c3aed",
        seller: "You",
        sellerInitials: "YO",
        rating: 5,
        saves: 0,
        type: "Textbook",
        description: result?.rawText
          ? `Scanned listing. ISBN: ${result.isbn ?? "not detected"}.`
          : "Manually listed via scanner.",
        included: [],
        meetupPoint: meetup || "Not specified",
        listedDaysAgo: 0,
      });
      setStage("done");
      setTimeout(() => {
        onList?.();
        onClose();
      }, 1600);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to publish listing."
      );
      setStage("result");
    }
  };

  const reset = () => {
    setStage("idle");
    setPreview(null);
    setResult(null);
    setError("");
    setTitle("");
    setAuthor("");
    setSubject("");
    setPrice("0");
    setMeetup("");
  };

  return (
    <>
      {/* Scoped responsive styles */}
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          background-color: rgba(24, 24, 27, 0.4);
          backdrop-filter: blur(4px);
          padding: 1rem;
        }
        .modal-card {
          width: 100%;
          max-width: 28rem;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          border-radius: 1rem;
          background-color: white;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          overflow: hidden;
        }
        .modal-header {
          display: flex;
          flex-shrink: 0;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid #E4E4E7;
          padding: 1.25rem 1.25rem 1rem;
        }
        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .modal-body::-webkit-scrollbar {
          width: 4px;
        }
        .modal-body::-webkit-scrollbar-thumb {
          background: #D4D4D8;
          border-radius: 2px;
        }
        .input-field {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #E4E4E7;
          background: white;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          color: #18181B;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          border-color: #18181B;
          box-shadow: 0 0 0 2px rgba(24,24,27,0.1);
        }
        .input-field::placeholder {
          color: #A1A1AA;
        }
        .btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 0.75rem;
          background: #18181B;
          color: white;
          border: none;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.625rem 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-primary:hover {
          background: #27272A;
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-radius: 0.75rem;
          border: 1px solid #E4E4E7;
          background: white;
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #18181B;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .btn-secondary:hover {
          background: #FAFAFA;
          border-color: #18181B;
        }
        @media (min-width: 640px) {
          .modal-overlay {
            align-items: center;
            padding: 1.5rem;
          }
          .modal-card {
            border-radius: 1.25rem;
          }
          .modal-header {
            padding: 1.5rem 1.5rem 1.25rem;
          }
          .modal-body {
            padding: 1.5rem;
            gap: 1.5rem;
          }
        }
      `}</style>

      <div className="modal-overlay">
        <div className="modal-card">
          {/* Header */}
          <div className="modal-header">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Camera size={20} color="#18181B" />
                <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#18181B" }}>
                  Scan a Book
                </h2>
              </div>
              <p style={{ marginTop: "0.125rem", fontSize: "0.75rem", color: "#71717A" }}>
                {stage === "idle" && "Point at a textbook cover or barcode"}
                {stage === "scanning" && "Extracting text and metadata…"}
                {stage === "result" &&
                  (result?.isbn
                    ? "ISBN detected — review the details"
                    : "No ISBN found — please verify")}
                {stage === "error" && "Scan failed"}
                {stage === "listing" && "Publishing your listing…"}
                {stage === "done" && "Listing published"}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                borderRadius: "0.5rem",
                padding: "0.375rem",
                color: "#A1A1AA",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F4F4F5";
                e.currentTarget.style.color = "#18181B";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#A1A1AA";
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {/* Idle state */}
            {stage === "idle" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={onFilePicked}
                  style={{ display: "none" }}
                />
                <button
                  onClick={() => fileInput.current?.click()}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem",
                    borderRadius: "0.75rem",
                    border: "2px dashed #D4D4D8",
                    padding: "2.5rem 1rem",
                    textAlign: "center",
                    background: "white",
                    cursor: "pointer",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#18181B";
                    e.currentTarget.style.background = "#FAFAFA";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#D4D4D8";
                    e.currentTarget.style.background = "white";
                  }}
                >
                  <div
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "50%",
                      background: "#F4F4F5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Upload size={24} color="#52525B" />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#18181B" }}>
                      Take or upload a photo
                    </p>
                    <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "#71717A" }}>
                      Cover or ISBN barcode works best
                    </p>
                  </div>
                </button>
                <div
                  style={{
                    borderRadius: "0.75rem",
                    border: "1px solid #E4E4E7",
                    background: "#FAFAFA",
                    padding: "1rem",
                  }}
                >
                  <p style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#A1A1AA" }}>
                    How it works
                  </p>
                  <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", lineHeight: 1.5, color: "#52525B" }}>
                    Your photo is processed by OCR to detect text and ISBN. We
                    then fetch real book metadata so you don&apos;t have to type it
                    all. You can edit everything before publishing.
                  </p>
                </div>
              </div>
            )}

            {/* Scanning state */}
            {stage === "scanning" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      height: "10rem",
                      width: "100%",
                      borderRadius: "0.75rem",
                      border: "1px solid #E4E4E7",
                      objectFit: "cover",
                    }}
                  />
                )}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "1rem 0" }}>
                  <Loader2 size={40} className="animate-spin" color="#18181B" />
                  <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#52525B" }}>
                    Scanning with OCR…
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "#71717A" }}>
                    <span style={{ width: "0.375rem", height: "0.375rem", borderRadius: "50%", background: "#18181B", animation: "pulse 1s infinite" }} />
                    This takes a few seconds
                  </div>
                </div>
              </div>
            )}

            {/* Error state */}
            {stage === "error" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      height: "8rem",
                      width: "100%",
                      borderRadius: "0.75rem",
                      border: "1px solid #E4E4E7",
                      objectFit: "cover",
                      opacity: 0.6,
                    }}
                  />
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    borderRadius: "0.75rem",
                    border: "1px solid #FECACA",
                    background: "#FFF1F2",
                    padding: "1rem",
                  }}
                >
                  <AlertCircle size={20} color="#E11D48" style={{ marginTop: "0.125rem" }} />
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#BE123C" }}>
                      Scan failed
                    </p>
                    <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "#E11D48" }}>
                      {error}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={reset} className="btn-primary" style={{ flex: 1 }}>
                    <RotateCcw size={16} />
                    Try Again
                  </button>
                  <button
                    onClick={() => {
                      setStage("result");
                      setError("");
                    }}
                    className="btn-secondary"
                  >
                    Enter Manually
                  </button>
                </div>
              </div>
            )}

            {/* Result / listing form */}
            {(stage === "result" || stage === "listing") && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      height: "8rem",
                      width: "100%",
                      borderRadius: "0.75rem",
                      border: "1px solid #E4E4E7",
                      objectFit: "cover",
                    }}
                  />
                )}

                {result && (
                  <div
                    style={{
                      borderRadius: "0.75rem",
                      border: `1px solid ${result.isbn ? "#A7F3D0" : "#FCD34D"}`,
                      background: result.isbn ? "rgba(236,253,245,0.5)" : "rgba(255,251,235,0.5)",
                      padding: "1rem",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                    }}
                  >
                    {result.isbn ? (
                      <CheckCircle2 size={18} color="#059669" style={{ marginTop: "0.125rem" }} />
                    ) : (
                      <AlertCircle size={18} color="#D97706" style={{ marginTop: "0.125rem" }} />
                    )}
                    <div>
                      <p style={{ fontSize: "0.875rem", fontWeight: 500, color: result.isbn ? "#065F46" : "#92400E" }}>
                        {result.isbn
                          ? `ISBN ${result.isbn} detected — metadata verified`
                          : "No ISBN found — please verify details below"}
                      </p>
                      {result.subjects.length > 0 && (
                        <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "#52525B" }}>
                          Subjects: {result.subjects.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {error && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#E11D48" }}>
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#A1A1AA", marginBottom: "0.25rem" }}>
                      Title
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="input-field"
                      placeholder="e.g. NCERT Chemistry Part 1"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Author</label>
                    <input
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="input-field"
                      placeholder="e.g. NCERT"
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <label style={labelStyle}>Subject</label>
                      <input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="input-field"
                        placeholder="Physics"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Price (₹)</label>
                      <input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="input-field"
                        inputMode="numeric"
                        placeholder="0 = free"
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ ...labelStyle, marginBottom: "0.5rem" }}>Condition</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
                      {["Like New", "Very Good", "Good", "Fair"].map((c) => (
                        <button
                          key={c}
                          onClick={() => setCondition(c)}
                          style={{
                            borderRadius: "0.5rem",
                            padding: "0.5rem 0.25rem",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            border: condition === c ? "none" : "1px solid #E4E4E7",
                            background: condition === c ? "#18181B" : "white",
                            color: condition === c ? "white" : "#18181B",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            if (condition !== c) {
                              e.currentTarget.style.borderColor = "#18181B";
                              e.currentTarget.style.background = "#FAFAFA";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (condition !== c) {
                              e.currentTarget.style.borderColor = "#E4E4E7";
                              e.currentTarget.style.background = "white";
                            }
                          }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Pickup Location</label>
                    <div style={{ position: "relative", marginTop: "0.25rem" }}>
                      <MapPin
                        size={16}
                        style={{
                          position: "absolute",
                          left: "0.75rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#A1A1AA",
                        }}
                      />
                      <input
                        value={meetup}
                        onChange={(e) => setMeetup(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: "2.25rem" }}
                        placeholder="e.g. Library entrance"
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={publish}
                    disabled={stage === "listing" || !title.trim()}
                    className="btn-primary"
                    style={{ flex: 1 }}
                  >
                    {stage === "listing" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Publishing…
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Publish Listing
                      </>
                    )}
                  </button>
                  <button onClick={reset} className="btn-secondary">
                    <RotateCcw size={16} />
                    Rescan
                  </button>
                </div>
              </div>
            )}

            {/* Done state */}
            {stage === "done" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "2.5rem 0", textAlign: "center" }}>
                <div style={{ width: "4rem", height: "4rem", borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle2 size={32} color="#059669" />
                </div>
                <div>
                  <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "#18181B" }}>
                    Listing Published
                  </p>
                  <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "#52525B" }}>
                    Your book is now visible in the marketplace.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#A1A1AA",
  marginBottom: "0.25rem",
};