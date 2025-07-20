"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Sign in to Debate Arena</h1>
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                onClick={() => signIn("google")}
            >
                Sign in with Google
            </button>
        </div>
    );
}
