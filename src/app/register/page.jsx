"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

// Zod schema for validation
const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data) => {
        console.log("Validated form data:", data);
        // Registration logic would go here
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
            <h1 className="text-2xl mb-6 font-bold">Register</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                {/* Name Field */}
                <div>
                    <label htmlFor="name" className="block mb-1 font-medium">Name</label>
                    <input
                        id="name"
                        type="text"
                        {...register("name")}
                        className={`w-full border rounded px-3 py-2 ${errors.name ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Enter your name"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                    <input
                        id="email"
                        type="email"
                        {...register("email")}
                        className={`w-full border rounded px-3 py-2 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="block mb-1 font-medium">Password</label>
                    <input
                        id="password"
                        type="password"
                        {...register("password")}
                        className={`w-full border rounded px-3 py-2 ${errors.password ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Enter your password"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 cursor-pointer rounded hover:bg-indigo-700 w-full"
                >
                    Register
                </button>
            </form>

            {/* Login Link */}
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium underline">
                    Please Login
                </Link>
            </p>
        </div>
    );
}
