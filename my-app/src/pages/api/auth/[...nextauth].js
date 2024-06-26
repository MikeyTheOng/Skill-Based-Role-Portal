import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';
// import { createConnection } from 'mysql2/promise';

export const authOptions = {
    // Configure one or more authentication providers
    secret: process.env.AUTH_SECRET,
    providers: [
        CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "Email",
        // `credentials` is used to generate a form on the sign in page.
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
            username: { label: "Email", type: "text", placeholder: "email" },
            // password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
            // return { id: "1", name: "J Smith", email: "jsmith@example.com" };
            const url = 'http://127.0.0.1:5100/get-user';
            const data = {
                email: credentials.username,
            };

            // Convert the data object to a JSON string
            const jsonData = JSON.stringify(data);

            // Define the headers for the request, including the content type
            const headers = {
                'Content-Type': 'application/json'
            };
            try {
                const response = await axios.post(url, jsonData, 
                    { headers: headers }
                )
                const status = response.status;
                const data = response.data;

                if (status === 200) {
                    console.log('data fetched:', data);
                    return data;
                } else if (status === 201) {
                    return null;
                }
            } catch (error) {
                console.error('Fetch error:', error);
                return null;
            }
        }
        })
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            // if (url.startsWith("/")) return `${baseUrl}${url}`
            // // Allows callback URLs on the same origin
            // else if (new URL(url).origin === baseUrl) return url
            // return baseUrl
            return baseUrl
        },
        async jwt({ token, user, session }) {
            console.log("jwt callback", {token, user, session});
            
            // * pass in user id to token
            if (user) {
                return {
                    ...token,
                    name: user.staff_FName + ' ' + user.staff_LName,
                    role: user.access_rights,
                    id: user.staff_id
                }
            }
            return token
        },
        async session({ session, token, user }) {
            console.log("session callback", {session, token, user})
            
            // * pass in user id to token
            return {
                ...session,
                name: token.name,
                role: token.role,
                id: token.id
            }
            return session;
        },
    }
    // debug: true
}

export default NextAuth(authOptions)