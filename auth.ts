import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      try {
        await connectDB();
        await User.findOneAndUpdate(
          { email: user.email },
          {
            $set: { name: user.name, email: user.email, image: user.image, googleId: profile?.sub },
            $setOnInsert: { isMentor: false, createdAt: new Date() },
          },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.error("signIn callback error:", err);
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: session.user.email })
            .select("_id isMentor mentorProfileId")
            .lean() as { _id: unknown; isMentor?: boolean; mentorProfileId?: unknown } | null;
          if (dbUser) {
            session.user.id       = String(dbUser._id);
            session.user.isMentor = dbUser.isMentor ?? false;
            session.user.mentorId = dbUser.mentorProfileId ? String(dbUser.mentorProfileId) : undefined;
          }
        } catch (err) {
          console.error("session callback error:", err);
        }
      }
      return session;
    },
  },
  pages: { signIn: "/auth/signin" },
});