"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const onSubmit = async (data) => {
        setFormError("");
        setIsSubmitting(true);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (res?.ok) {
                router.push("/");
            } else {
                setFormError("Invalid email or password.");
            }
        } catch (error) {
            setFormError("Something went wrong. Please try again.");
            console.error("Login error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handler for Google sign in
    const handleGoogleLogin = async () => {
        setFormError("");
        setIsSubmitting(true);

        try {
            // redirect: true will redirect immediately
            await signIn("google", { callbackUrl: "/" });
        } catch (error) {
            setFormError("Google login failed. Please try again.");
            console.error("Google login error:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
            <h1 className="text-2xl mb-6 font-bold">Login</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block mb-1 font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register("email")}
                        className={`w-full border rounded px-3 py-2 ${errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="block mb-1 font-medium">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        {...register("password")}
                        className={`w-full border rounded px-3 py-2 ${errors.password ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Enter your password"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                </div>

                {/* Global Login Error */}
                {formError && (
                    <p className="text-red-500 text-sm text-center">{formError}</p>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
            </form>

            {/* Or separator */}
            <div className="my-6 flex items-center">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-2 text-gray-500">OR</span>
                <hr className="flex-grow border-gray-300" />
            </div>

            {/* Google Login Button */}
            <button
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="w-5 h-5"
                >
                    <path
                        fill="#4285F4"
                        d="M24 9.5c3.54 0 6.68 1.35 9.11 3.55l6.83-6.83C34.42 2.6 29.57 1 24 1 14.73 1 6.97 7.23 3.87 15.72l7.95 6.17C12.6 14.18 17.69 9.5 24 9.5z"
                    />
                    <path
                        fill="#34A853"
                        d="M46.5 24c0-1.63-.15-3.22-.43-4.75H24v9h12.84c-.55 3-2.3 5.55-4.9 7.27l7.54 5.86C43.6 36.07 46.5 30.66 46.5 24z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M11.82 28.24a14.41 14.41 0 01-.77-4.24c0-1.48.26-2.91.77-4.24L3.87 15.72C1.35 20.74 0 26.06 0 31.5c0 5.44 1.35 10.76 3.87 15.78l7.95-6.17z"
                    />
                    <path
                        fill="#EA4335"
                        d="M24 46c5.57 0 10.42-1.6 14.08-4.36l-7.54-5.86c-2.09 1.4-4.78 2.24-6.54 2.24-6.31 0-11.4-4.68-12.17-10.92L3.87 32.28 3.87 32.28 3.87 32.28l-7.95 6.17C6.97 40.77 14.73 47 24 47z"
                    />
                </svg>
                Continue with Google
            </button>

            {/* New user register prompt */}
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                New here?{" "}
                <Link
                    href="/register"
                    className="text-indigo-600 hover:text-indigo-800 font-medium underline"
                >
                    Please Register
                </Link>
            </p>
        </div>
    );
}
