// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Use the standard Next.js matcher pattern
  // This ensures middleware doesn't run on static files, images, or the favicon
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};