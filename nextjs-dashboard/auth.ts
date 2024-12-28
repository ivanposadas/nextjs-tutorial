import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import FacebookProvider from 'next-auth/providers/facebook';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import type { User } from '@/app/lib/definitions';
import crypto from 'crypto';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID ?? '',
      clientSecret: process.env.FACEBOOK_SECRET ?? '',
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
        };
      },
    }),
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);

          if (!parsedCredentials.success) return null;

          const { email, password } = parsedCredentials.data;
          const result = await sql<User>`
            SELECT * FROM users WHERE email=${email}
          `;
          const user = result.rows[0];

          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        console.error('No email provided from social login');
        return false;
      }

      try {
        // Check if user exists
        const result = await sql`
          SELECT * FROM users WHERE email=${user.email}
        `;

        if (result.rows.length === 0) {
          // Create new user if doesn't exist
          const userId = crypto.randomUUID();
          await sql`
            INSERT INTO users (id, name, email, password, image)
            VALUES (${userId}, ${user.name || ''}, ${user.email}, '', ${user.image || null})
          `;
          user.id = userId;
        } else {
          // Update existing user with latest info
          const existingUser = result.rows[0];
          user.id = existingUser.id;
          if (user.image && user.image !== existingUser.image) {
            await sql`
              UPDATE users 
              SET image = ${user.image}, name = ${user.name || existingUser.name}
              WHERE id = ${existingUser.id}
            `;
          }
        }
        return true;
      } catch (error) {
        console.error('Database error during social login:', error);
        return false;
      }
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.image = token.image as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: true,
});