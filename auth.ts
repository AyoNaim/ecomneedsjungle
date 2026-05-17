// auth.ts
// In Auth.js (v5), configuring middleware is a two-step process because the middleware runs on the Edge Runtime,
// which does not support the Prisma adapter directly. 
// To solve this, we split the configuration into a "lite" config for the middleware 
// and a "full" config for the main application.

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code'
        }
      },
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: "onboarding@resend.dev"
    })
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ account, user, profile }) {
      if(account?.provider === 'google' && profile?.picture && user.email) {

          // 1. Extract the raw image URL from the Google profile payload
          let highResAvatar = profile.picture;

          // 2. PREMIUM UPGRADE REGEX: Replace =s96-c, =s32, etc., with =s500-c for crisp rendering
          // This looks for '=s' followed by digits and optional cropping configuration at the end of the URL
          if (highResAvatar.includes('=s')) {
            highResAvatar = highResAvatar.replace(/=s\d+(-\w)?$/, '=s500-c');
          } else if (highResAvatar.includes('/s96-c/')) {
            // Fallback for an older alternative URL style format Google sometimes uses
            highResAvatar = highResAvatar.replace('/s96-c/', '/s500-c/');
          }

        const existingUser = await prisma.user.findUnique({
          where: {
            email: user.email
          }
        })

        if (existingUser && !existingUser.image) {
          await prisma.user.update({
            where: { id: existingUser.id},
            data: {
              image: highResAvatar
            }
          })
        }
      }
      return true
    }
  }
});