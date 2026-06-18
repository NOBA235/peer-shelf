"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="glass w-full max-w-sm rounded-3xl p-8 space-y-8 text-center">
        <div className="space-y-3">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-violet-400 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-lg shadow-violet-900/40">
            📚
          </div>
          <h1 className="heading-md text-white">Peer<span className="text-violet-400">&</span>Shelf</h1>
          <p className="body-sm">Student Resource Network</p>
        </div>

        <div className="space-y-2 text-left">
          {[
            ["📦","List textbooks & notes for sale or donation"],
            ["🌟","Become a mentor — share your knowledge"],
            ["🔖","Request resources, get matched automatically"],
            ["🔔","Get notified when your books are requested"],
          ].map(([icon, text]) => (
            <div key={text as string} className="flex items-center gap-3">
              <span className="text-lg flex-shrink-0">{icon}</span>
              <p className="body-sm text-white/70">{text as string}</p>
            </div>
          ))}
        </div>

        <button
          onClick={async () => { setLoading(true); await signIn("google", { callbackUrl: "/" }); }}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3.5 px-6 rounded-xl transition-all disabled:opacity-60 shadow-lg"
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {loading ? "Signing in…" : "Continue with Google"}
        </button>

        <p className="caption">No password needed · Your Google account is used for identity only</p>
      </div>
    </div>
  );
}