"use client";

import { useEffect, useState } from "react";

export default function DebatesPage() {
    const [debates, setDebates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDebates = async () => {
            try {
                const res = await fetch("http://localhost:5000/debates");
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

    const handleJoin = async (debateId, side) => {
        const name = prompt(`Enter your name to join the ${side} side:`);

        if (!name) return alert("Name is required to join.");

        try {
            const res = await fetch(`http://localhost:5000/debates/${debateId}/join`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, side }),
            });

            const result = await res.json();

            if (res.ok) {
                alert(`Successfully joined as ${side}.`);
            } else {
                alert(result.error || "Failed to join.");
            }
        } catch (error) {
            console.error("Join error:", error);
            alert("Error joining debate.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-center mb-10">All Debates</h1>

            {loading ? (
                <p className="text-center">Loading debates...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {debates.map((debate) => (
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

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleJoin(debate._id, "Support")}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Join Support
                                </button>
                                <button
                                    onClick={() => handleJoin(debate._id, "Oppose")}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                >
                                    Join Oppose
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
