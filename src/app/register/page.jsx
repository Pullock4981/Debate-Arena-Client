"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";

export default function RegisterPage() {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        console.log("Register form data:", data);
        // You can add your registration logic here later
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
            <h1 className="text-2xl mb-6 font-bold">Register</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block mb-1 font-medium">Name</label>
                    <input
                        id="name"
                        type="text"
                        {...register("name")}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                    />
                </div>
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
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full"
                >
                    Register
                </button>
            </form>

            {/* Existing user prompt */}
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    Please Login
                </Link>
            </p>
        </div>
    );
}
