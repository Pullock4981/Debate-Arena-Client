"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function PostArgumentPage() {
    const searchParams = useSearchParams();
    const debateId = searchParams.get("debateId");
    const side = searchParams.get("side");
    const name = searchParams.get("name");

    const [text, setText] = useState("");
    const router = useRouter();

    const handleSubmit = () => {
        if (!text.trim()) return alert("Argument cannot be empty.");

        const newArgument = {
            id: Date.now(), // unique ID
            name,
            debateId,
            side,
            text,
            timestamp: Date.now(),
            votes: 0,
        };

        const saved = JSON.parse(localStorage.getItem("arguments") || "[]");
        saved.push(newArgument);
        localStorage.setItem("arguments", JSON.stringify(saved));

        // Redirect back
        router.push("/joinedDebate");
    };

    return (
        <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow rounded">
            <h1 className="text-xl font-bold mb-4">Post Your Argument</h1>
            <p><strong>Debate ID:</strong> {debateId}</p>
            <p><strong>Side:</strong> {side}</p>
            <p><strong>Name:</strong> {name}</p>

            <textarea
                placeholder="Type your argument..."
                className="w-full mt-4 p-2 border rounded min-h-[100px]"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <button
                onClick={handleSubmit}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Submit Argument
            </button>
        </div>
    );
}
