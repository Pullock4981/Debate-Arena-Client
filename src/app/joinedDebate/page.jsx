"use client";

import { useEffect, useState } from "react";

export default function JoinedDebatePage() {
    const [joinedDebates, setJoinedDebates] = useState([]);

    // Load joined debates from localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("joinedDebates") || "[]");
        setJoinedDebates(saved);
    }, []);

    // Optional: clear joined debates
    const clearDebates = () => {
        localStorage.removeItem("joinedDebates");
        setJoinedDebates([]);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-6 text-center">Your Joined Debates</h1>

            {joinedDebates.length === 0 ? (
                <p className="text-gray-600 text-center">You haven’t joined any debates yet.</p>
            ) : (
                <ul className="space-y-4">
                    {joinedDebates.map((debate, index) => (
                        <li key={index} className="border rounded p-4 bg-gray-50">
                            <p><strong>Name:</strong> {debate.name}</p>
                            <p><strong>Debate ID:</strong> {debate.debateId}</p>
                            <p><strong>Side:</strong> {debate.side}</p>
                            <p className="text-sm text-gray-500">
                                <strong>Joined at:</strong> {new Date(debate.joinedAt).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}

            {joinedDebates.length > 0 && (
                <div className="text-center mt-6">
                    <button
                        onClick={clearDebates}
                        className="text-red-500 hover:text-red-700 text-sm underline"
                    >
                        Clear All Joined Debates
                    </button>
                </div>
            )}
        </div>
    );
}
