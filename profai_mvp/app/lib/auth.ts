
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import { withDatabaseTimeout } from '@/lib/db-utils';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  // Don't use PrismaAdapter for demo mode - it requires database
  // adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        console.log('🔐 Attempting login for:', credentials.email);

        // Demo accounts - work without database
        const demoAccounts = [
          {
            email: 'john@doe.com',
            password: 'johndoe123',
            id: 'demo_john_doe',
            name: 'John Doe',
            firstName: 'John',
            lastName: 'Doe'
          },
          {
            email: 'demo@profai.com',
            password: 'profai2025',
            id: 'demo_profai',
            name: 'Demo User',
            firstName: 'Demo',
            lastName: 'User'
          }
        ];

        // Check demo accounts first
        const demoUser = demoAccounts.find(
          account => account.email.toLowerCase() === credentials.email.toLowerCase()
        );

        if (demoUser) {
          console.log('🎭 Demo account detected:', demoUser.email);
          if (demoUser.password === credentials.password) {
            console.log('✅ Demo login successful');
            return {
              id: demoUser.id,
              email: demoUser.email,
              name: demoUser.name,
              firstName: demoUser.firstName,
              lastName: demoUser.lastName,
            };
          } else {
            console.log('❌ Demo password incorrect');
            return null;
          }
        }

        // Try database auth with timeout fallback
        try {
          console.log('🗄️ Attempting database authentication...');
          
          const user = await withDatabaseTimeout(
            () => prisma.user.findUnique({ where: { email: credentials.email } }),
            { timeoutMs: 8000, fallbackData: null }
          );

          if (!user || !user.password) {
            console.log('❌ User not found in database');
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            console.log('❌ Database password incorrect');
            return null;
          }

          console.log('✅ Database authentication successful');
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            firstName: user.firstName,
            lastName: user.lastName,
          };

        } catch (dbError: any) {
          console.error('🗄️ Database authentication failed:', dbError.message);
          console.log('⚠️ Falling back to demo mode - check credentials against demo accounts only');
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin'
  },
  secret: process.env.NEXTAUTH_SECRET,
};
