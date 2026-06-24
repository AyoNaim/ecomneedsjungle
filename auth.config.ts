// auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. Initial Sign-In
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.isOnboarded = (user as any).isOnboarded ?? false;
        token.email = user.email;
        token.image = user.image ?? null; 
      }

      // 2. Dynamic Session Updates
      if (trigger === "update" && session) {
        const newSessionData = session.user ? session.user : session;
        if (typeof newSessionData.isOnboarded !== "undefined") token.isOnboarded = newSessionData.isOnboarded;
        if (newSessionData.image) token.image = newSessionData.image;
        if (newSessionData.name) token.name = newSessionData.name;
        if (newSessionData.role) token.role = newSessionData.role; 
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).isOnboarded = token.isOnboarded as boolean;
        session.user.email = token.email as string;
        session.user.image = token.image as string | null;
        (session.user as any).role = token.role;
      }
      return session; 
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnboarded = (auth?.user as any)?.isOnboarded;
      const isAdmin = (auth?.user as any)?.role === "ADMIN"; // Safe chaining
      const { pathname } = nextUrl;

      const isOnboardingRoute = pathname.startsWith("/onboarding");
      const isLoginRoute = pathname.startsWith("/login");
      const isAdminRoute = pathname.startsWith("/admin");
      const isAdminApiRoute = pathname.startsWith("/api/admin");

      const isProtectedRoute = 
        pathname.startsWith("/dashboard") || 
        pathname.startsWith("/checkout") ||
        pathname.startsWith("/settings");

      // --- 1. LOGIN PAGE LOGIC ---
      if (isLoginRoute) {
        if (isLoggedIn) {
          // Push authenticated users away from the login page
          return isOnboarded 
            ? Response.redirect(new URL("/catalog", nextUrl)) 
            : Response.redirect(new URL("/onboarding", nextUrl));
        }
        return true; // Let unauthenticated users see the login page
      }

      // --- 2. ONBOARDING LOGIC ---
      if (isLoggedIn && !isOnboarded) {
        if (isOnboardingRoute) return true; // Let them stay and finish
        return Response.redirect(new URL("/onboarding", nextUrl)); // Force them to finish
      }

      if (isOnboardingRoute && isLoggedIn && isOnboarded) {
        return Response.redirect(new URL("/catalog", nextUrl)); // Already done, move along
      }

      // --- 3. HIGH SECURITY DOMAIN (ADMIN PERIMETER) ---
      if (isAdminRoute || isAdminApiRoute) {
        if (!isLoggedIn) return false; // Boot unauthenticated users to login
        
        if (!isAdmin) {
          if (isAdminRoute) return Response.redirect(new URL("/", nextUrl));
          return Response.json(
            { error: "ACCESS DENIED // INSUFFICIENT CLEARANCE" },
            { status: 403 }
          );
        }
        return true; // User is logged in AND is an admin
      }

      // --- 4. STANDARD PROTECTED DOMAIN ---
      if (isProtectedRoute) {
        if (!isLoggedIn) return false; // Boot unauthenticated users to login
        return true;
      }

      // --- 5. ALLOW ALL OTHER PUBLIC ROUTES ---
      return true;
    },
  },
  providers: [], 
} satisfies NextAuthConfig;