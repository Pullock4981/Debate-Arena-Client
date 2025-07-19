// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                const { email, password } = credentials;
                console.log("NextAuth authorize called with:", email, password);

                try {
                    const res = await fetch("http://localhost:5000/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await res.json();

                    if (res.ok && data?.user) {
                        // Optionally, you can sanitize the user object before returning it
                        return {
                            id: data.user.id || data.user._id,
                            name: data.user.name,
                            email: data.user.email,
                        };
                    }

                    return null;
                } catch (error) {
                    console.error("❌ Error during authorization:", error);
                    return null;
                }
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: "/login",
    },
});

export { handler as GET, handler as POST };
