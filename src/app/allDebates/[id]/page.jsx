'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DebateSummary from "@/components/DebateSummary";
// import DebateSummary from "@/app/components/DebateSummary";

export default function DebateDetailsPage() {
    const { id } = useParams();
    const router = useRouter();

    const [debate, setDebate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchDebate = async () => {
            try {
                const res = await fetch(`https://data-arena-server.onrender.com/.app/debates/${id}`);
                if (!res.ok) throw new Error("Debate not found");
                const data = await res.json();
                setDebate(data);
            } catch (error) {
                console.error("Error fetching debate:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDebate();
    }, [id]);

    const handleJoin = async (side) => {
        const name = prompt("Enter your name to join:");
        if (!name) return alert("Name is required");

        const joined = JSON.parse(localStorage.getItem("joinedDebates") || "[]");
        const existing = joined.find(
            (entry) => entry.debateId === id && entry.name === name
        );

        if (existing) {
            if (existing.side === side) {
                alert(`You have already joined this debate as ${side}.`);
                return;
            } else {
                alert("You cannot join both sides in the same debate.");
                return;
            }
        }

        setJoining(true);

        try {
            const res = await fetch(`https://data-arena-server.onrender.com/.app/debates/${id}/join`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, side }),
            });

            const result = await res.json();
            if (!res.ok) {
                return alert(result.error || "Failed to join.");
            }

            joined.push({
                name,
                debateId: id,
                side,
                joinedAt: new Date().toISOString(),
            });
            localStorage.setItem("joinedDebates", JSON.stringify(joined));

            router.push("/joinedDebate");
        } catch (error) {
            console.error("Join error:", error);
            alert("Error joining debate.");
        } finally {
            setJoining(false);
        }
    };

    if (loading) return <p className="text-center py-10">Loading...</p>;
    if (!debate) return <p className="text-center py-10 text-red-500">Debate not found.</p>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">{debate.title}</h1>

            <div className="p-6 border rounded shadow bg-white mb-10">
                <p className="text-gray-700 mb-2">{debate.description}</p>
                <p className="text-sm text-gray-500"><strong>Category:</strong> {debate.category}</p>
                <p className="text-sm text-gray-500"><strong>Duration:</strong> {debate.duration} minutes</p>
                <p className="text-sm text-gray-500">
                    <strong>Tags:</strong> {Array.isArray(debate.tags) ? debate.tags.join(", ") : debate.tags}
                </p>
            </div>

            <div className="flex gap-4 justify-center">
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                    onClick={() => handleJoin("Support")}
                    disabled={joining}
                >
                    {joining ? "Joining..." : "Join as Support"}
                </button>
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                    onClick={() => handleJoin("Oppose")}
                    disabled={joining}
                >
                    {joining ? "Joining..." : "Join as Oppose"}
                </button>
            </div>

            {/* ✅ Injected Debate Summary Below */}
            <DebateSummary
                debateId={id}
                createdAt={debate.createdAt}
                duration={debate.duration}
            />
        </div>
    );
}
