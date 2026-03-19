import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@loenbro.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                
                // Static override to bypass Prisma database check completely
                if (credentials.email === "admin@loenbro.com" && credentials.password === "password") {
                    return {
                        id: "1",
                        email: "admin@loenbro.com",
                        name: "Initial Admin",
                        role: "Admin"
                    } as any;
                }

                return null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                if (session.user) {
                    (session.user as any).id = token.id;
                    (session.user as any).role = token.role;
                }
            }
            return session;
        }
    },
    pages: {
        signIn: "/api/auth/signin", // default next auth signin
    }
};
