"use client";
import { Camera, Zap, Upload } from "lucide-react";
import { SectionLabel } from "../ui";

interface Props {
  onOpenScanner: () => void;
}

export default function ScanSection({ onOpenScanner }: Props) {
  return (
    <>
      {/* Scoped responsive styles */}
      <style>{`
        .scan-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 4rem 1rem;
          margin: 0 auto;
          max-width: 64rem;
        }
        .scan-headline {
          margin-top: 0.75rem;
          max-width: 28rem;
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.2;
          color: #18181B;
        }
        .scan-desc {
          margin-top: 0.75rem;
          max-width: 24rem;
          font-size: 0.875rem;
          color: #52525B;
        }
        .scan-trigger {
          margin-top: 2.5rem;
          width: 100%;
          max-width: 20rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          border-radius: 1rem;
          border: 2px dashed #D4D4D8;
          background-color: white;
          padding: 2.5rem 1.5rem;
          transition: border-color 0.2s, background-color 0.2s;
          cursor: pointer;
        }
        .scan-trigger:hover {
          border-color: #18181B;
          background-color: #FAFAFA;
        }
        .scan-trigger .camera-circle {
          display: flex;
          width: 3.5rem;
          height: 3.5rem;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: #F4F4F5;
          transition: background-color 0.2s;
        }
        .scan-trigger:hover .camera-circle {
          background-color: #18181B;
        }
        .scan-trigger .camera-circle svg {
          color: #52525B;
          transition: color 0.2s;
        }
        .scan-trigger:hover .camera-circle svg {
          color: white;
        }
        .steps-grid {
          margin-top: 3.5rem;
          width: 100%;
          max-width: 32rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          text-align: left;
        }
        .cta-button {
          margin-top: 2.5rem;
          width: 100%;
          max-width: 20rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 0.75rem;
          background-color: #18181B;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: white;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .cta-button:hover {
          background-color: #27272A;
        }
        .cta-button:focus {
          outline: 2px solid #18181B;
          outline-offset: 2px;
        }
        @media (min-width: 640px) {
          .scan-container {
            padding: 6rem 1.5rem;
          }
          .scan-headline {
            font-size: 1.875rem;
          }
          .steps-grid {
            grid-template-columns: repeat(3, 1fr);
            text-align: center;
          }
        }
      `}</style>

      <div style={{ minHeight: "100vh", backgroundColor: "#FAFAFA", color: "#18181B" }}>
        <div className="scan-container">
          {/* Badge / label */}
          <SectionLabel>Book Scanner</SectionLabel>

          {/* Headline */}
          <h1 className="scan-headline">
            Scan any textbook, list it instantly
          </h1>
          <p className="scan-desc">
            Point your camera at a book cover. We extract the title, author, and
            let you set a price in under 30 seconds.
          </p>

          {/* Scan trigger */}
          <button onClick={onOpenScanner} className="scan-trigger">
            <div className="camera-circle">
              <Camera size={24} />
            </div>
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#18181B" }}>
              Tap to open camera or upload
            </span>
            <span style={{ fontSize: "0.75rem", color: "#71717A" }}>
              Works with ISBN barcodes & cover photos
            </span>
          </button>

          {/* How it works – 3 steps */}
          <div className="steps-grid">
            {[
              {
                icon: Camera,
                title: "Snap a photo",
                desc: "Take a picture of any textbook cover or barcode.",
              },
              {
                icon: Zap,
                title: "Instant metadata",
                desc: "We read the ISBN, fetch real title & author details.",
              },
              {
                icon: Upload,
                title: "List in seconds",
                desc: "Set price, condition, and publish. Done.",
              },
            ].map((step) => (
              <div key={step.title}>
                <step.icon size={24} color="#18181B" />
                <h3 style={{ marginTop: "0.5rem", fontSize: "0.875rem", fontWeight: 600, color: "#18181B" }}>
                  {step.title}
                </h3>
                <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", lineHeight: 1.5, color: "#71717A" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <button onClick={onOpenScanner} className="cta-button">
            <Camera size={18} />
            Open Scanner
          </button>
        </div>
      </div>
    </>
  );
}