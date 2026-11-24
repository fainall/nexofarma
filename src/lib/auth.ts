import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";
import { hit, isBlocked, reset } from "./rateLimit";

// Bloqueo por cuenta: tras 10 claves erróneas, la cuenta queda bloqueada 15 minutos.
const MAX_FALLOS = 10;
const BLOQUEO_MS = 15 * 60_000;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const key = `login|${credentials.email.trim().toLowerCase()}`;
        if (isBlocked(key, MAX_FALLOS)) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        const isValid = user ? await compare(credentials.password, user.passwordHash) : false;
        if (!user || !isValid) {
          hit(key, MAX_FALLOS, BLOQUEO_MS);
          return null;
        }
        reset(key);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // la sesión del panel expira a las 8 horas
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as { id: string; role?: string };
        u.id = token.id as string;
        u.role = token.role as string | undefined;
      }
      return session;
    },
  },
};
