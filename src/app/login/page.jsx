"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

export default function LoginPage() {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        console.log("Form data:", data);
        // For now, no auth logic
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
            <h1 className="text-2xl mb-6 font-bold">Login</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                    <input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block mb-1 font-medium">Password</label>
                    <input
                        id="password"
                        type="password"
                        {...register("password")}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 cursor-pointer rounded hover:bg-indigo-700"
                >
                    Login
                </button>
            </form>
            {/* New user register prompt */}
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                New here?{" "}
                <Link
                    href="/register"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    Please Register
                </Link>
            </p>
        </div>
    );
}
