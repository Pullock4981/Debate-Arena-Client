"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function JoinedDebatePage() {
    const searchParams = useSearchParams();
    const userName = searchParams.get("name");
    const debateId = searchParams.get("debateId");

    const [joinedDebate, setJoinedDebate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!userName || !debateId) return;

        const fetchJoinedDebate = async () => {
            try {
                const res = await fetch(`http://localhost:5000/joinedDebates?name=${encodeURIComponent(userName)}&debateId=${debateId}`);
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || "Joined debate not found");
                }
                const data = await res.json();

                setJoinedDebate(data);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message || "Failed to fetch joined debate");
            } finally {
                setLoading(false);
            }
        };

        fetchJoinedDebate();
    }, [userName, debateId]);

    if (!userName || !debateId) return <p className="text-center py-10">Waiting for route params...</p>;
    if (loading) return <p className="text-center py-10">Loading...</p>;
    if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
    if (!joinedDebate) return <p className="text-center py-10">No debate data.</p>;

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-4">Your Joined Debate</h1>
            <div className="bg-white shadow rounded p-6 border">
                <p><strong>Title:</strong> {joinedDebate.title}</p>
                <p><strong>Description:</strong> {joinedDebate.description}</p>
                <p><strong>Category:</strong> {joinedDebate.category}</p>
                <p><strong>Duration:</strong> {joinedDebate.duration}</p>
                <p><strong>Tags:</strong> {Array.isArray(joinedDebate.tags) ? joinedDebate.tags.join(", ") : joinedDebate.tags}</p>
                <p className="mt-4">
                    👤 You ({joinedDebate.name}) joined as:{" "}
                    <span className={joinedDebate.side === "Support" ? "text-green-600" : "text-red-600"}>
                        {joinedDebate.side}
                    </span>
                </p>
            </div>
        </div>
    );
}
