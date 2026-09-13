import GitHubProvider from "next-auth/providers/github";

const allowedLogins = (process.env.ALLOWED_GITHUB_LOGINS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ profile }) {
      if (allowedLogins.length === 0) return false;
      const login = (profile?.login || "").toLowerCase();
      return allowedLogins.includes(login);
    },
    async jwt({ token, profile }) {
      if (profile?.login) {
        token.login = profile.login;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.login = token.login;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin",
  },
};
