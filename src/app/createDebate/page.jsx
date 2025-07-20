"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

// Zod schema for validation without image
const debateSchema = z.object({
    title: z.string().min(3, "Title is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    tags: z.string().min(1, "Tags are required"),
    category: z.string().min(1, "Select a category"),
    duration: z.string().min(1, "Select a duration"),
});

export default function DebateCreatePage() {
    const [submitting, setSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(debateSchema),
    });

    const onSubmit = async (data) => {
        setSubmitting(true);

        try {
            const debateData = {
                title: data.title,
                description: data.description,
                category: data.category,
                duration: data.duration,
                tags: data.tags.split(",").map((tag) => tag.trim()),
            };

            const res = await fetch("https://data-arena-server.onrender.com/.app/debates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(debateData),
            });

            const result = await res.json();

            if (res.ok) {
                alert("Debate created successfully!");
                reset();
            } else {
                console.error("Server error:", result);
                alert("Failed to create debate.");
            }
        } catch (err) {
            console.error("Client error:", err);
            alert("Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Create a New Debate</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Title */}
                <InputField label="Title" name="title" register={register} error={errors.title} />

                {/* Description */}
                <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea
                        {...register("description")}
                        rows="3"
                        className={`w-full border px-3 py-2 rounded ${errors.description ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Write a detailed description..."
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                </div>

                {/* Tags & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Tags (comma-separated)"
                        name="tags"
                        register={register}
                        error={errors.tags}
                        placeholder="e.g., tech, ethics"
                    />
                    <div>
                        <label className="block font-medium mb-1">Category</label>
                        <select
                            {...register("category")}
                            className={`w-full border px-3 py-2 rounded ${errors.category ? "border-red-500" : "border-gray-300"
                                }`}
                        >
                            <option value="">Select category</option>
                            <option value="Technology">Technology</option>
                            <option value="Politics">Politics</option>
                            <option value="Ethics">Ethics</option>
                            <option value="Science">Science</option>
                        </select>
                        {errors.category && (
                            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                        )}
                    </div>
                </div>

                {/* Duration */}
                <div>
                    <label className="block font-medium mb-1">Debate Duration</label>
                    <select
                        {...register("duration")}
                        className={`w-full border px-3 py-2 rounded ${errors.duration ? "border-red-500" : "border-gray-300"
                            }`}
                    >
                        <option value="">Select duration</option>
                        <option value="1h">1 Hour</option>
                        <option value="12h">12 Hours</option>
                        <option value="24h">24 Hours</option>
                    </select>
                    {errors.duration && (
                        <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                    disabled={submitting}
                >
                    {submitting ? "Creating..." : "Create Debate"}
                </button>
            </form>
        </div>
    );
}

function InputField({ label, name, register, error, placeholder = "" }) {
    return (
        <div>
            <label className="block font-medium mb-1">{label}</label>
            <input
                type="text"
                {...register(name)}
                placeholder={placeholder}
                className={`w-full border px-3 py-2 rounded ${error ? "border-red-500" : "border-gray-300"
                    }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
    );
}
