"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DebatesPage() {
    const [debates, setDebates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [now, setNow] = useState(Date.now());
    const router = useRouter();

    useEffect(() => {
        const fetchDebates = async () => {
            try {
                const res = await fetch("https://data-arena-server.onrender.com/.app/debates");
                const data = await res.json();
                setDebates(data);
            } catch (error) {
                console.error("Error fetching debates:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDebates();
    }, []);

    // Update current time every second for countdown timers
    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Parse duration string ("1h", "30") to minutes
    const parseDuration = (duration) => {
        if (typeof duration === "string") {
            if (duration.endsWith("h")) {
                return parseInt(duration) * 60;
            }
            return parseInt(duration);
        }
        return 0;
    };

    // Calculate remaining seconds
    const getRemainingSeconds = (debate) => {
        if (!debate.createdAt || !debate.duration) return 0;

        const durationMinutes = parseDuration(debate.duration);
        const startTime = new Date(debate.createdAt).getTime();

        const endTime = startTime + durationMinutes * 60 * 1000;
        return Math.max(0, Math.floor((endTime - now) / 1000));
    };

    // Format seconds as "0 H 0 Min 0 Sec"
    const formatHMS = (secs) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return `${h} H ${m} Min ${s} Sec`;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-center mb-10">All Debates</h1>

            {loading ? (
                <p className="text-center">Loading debates...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {debates.map((debate) => {
                        const remainingSeconds = getRemainingSeconds(debate);
                        const isClosed = remainingSeconds === 0;

                        return (
                            <div key={debate._id} className="p-6 border rounded shadow bg-white">
                                <h2 className="text-xl font-bold mb-2">{debate.title}</h2>
                                <p className="text-gray-700 mb-2">{debate.description}</p>
                                <p className="text-sm text-gray-500 mb-1">
                                    <strong>Category:</strong> {debate.category}
                                </p>
                                <p className="text-sm text-gray-500 mb-1">
                                    <strong>Duration:</strong> {debate.duration}
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    <strong>Tags:</strong>{" "}
                                    {Array.isArray(debate.tags) ? debate.tags.join(", ") : debate.tags}
                                </p>
                                <p className="text-sm font-semibold mb-4">
                                    Time Left: {isClosed ? "Closed" : formatHMS(remainingSeconds)}
                                </p>
                                <button
                                    onClick={() => router.push(`/allDebates/${debate._id}`)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    disabled={isClosed}
                                >
                                    View Details
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
