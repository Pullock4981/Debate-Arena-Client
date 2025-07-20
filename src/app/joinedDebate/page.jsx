"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinedDebatePage() {
    const [joinedDebates, setJoinedDebates] = useState([]);
    const [argumentsList, setArgumentsList] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [userVotes, setUserVotes] = useState({});
    const router = useRouter();

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("joinedDebates") || "[]");

        // Parse duration string (e.g. "1h", "12h") to minutes number for each debate
        const parsedDebates = saved.map((debate) => {
            let durationMin = 0;
            if (debate.duration) {
                if (debate.duration.endsWith("h")) {
                    durationMin = parseInt(debate.duration) * 60;
                } else {
                    durationMin = parseInt(debate.duration);
                }
            }
            return {
                ...debate,
                durationMin,
                startTime: debate.startTime ? new Date(debate.startTime).getTime() : Date.now(),
            };
        });

        setJoinedDebates(parsedDebates);

        const args = JSON.parse(localStorage.getItem("arguments") || "[]");
        setArgumentsList(args);

        const votes = JSON.parse(localStorage.getItem("userVotes") || "{}");
        setUserVotes(votes);
    }, []);

    const clearDebates = () => {
        localStorage.removeItem("joinedDebates");
        setJoinedDebates([]);
    };

    const handlePostArgument = (debateId, side, name, isClosed) => {
        if (isClosed) return; // disable posting if debate closed
        router.push(
            `/postArgument?debateId=${debateId}&side=${side}&name=${encodeURIComponent(name)}`
        );
    };

    const handleDelete = (id) => {
        const updated = argumentsList.filter((arg) => arg.id !== id);
        setArgumentsList(updated);
        localStorage.setItem("arguments", JSON.stringify(updated));
    };

    const handleEdit = (id, currentText) => {
        setEditingId(id);
        setEditText(currentText);
    };

    const handleSaveEdit = (id) => {
        const updated = argumentsList.map((arg) =>
            arg.id === id ? { ...arg, text: editText } : arg
        );
        setArgumentsList(updated);
        localStorage.setItem("arguments", JSON.stringify(updated));
        setEditingId(null);
        setEditText("");
    };

    const canEdit = (timestamp) => {
        return Date.now() - timestamp < 5 * 60 * 1000; // 5 minutes
    };

    const handleVote = (id, isClosed) => {
        if (isClosed) return; // disable voting if debate closed
        if (userVotes[id]) return; // prevent multiple votes

        const updatedArgs = argumentsList.map((arg) =>
            arg.id === id ? { ...arg, votes: arg.votes + 1 } : arg
        );

        const updatedVotes = { ...userVotes, [id]: true };

        setArgumentsList(updatedArgs);
        setUserVotes(updatedVotes);
        localStorage.setItem("arguments", JSON.stringify(updatedArgs));
        localStorage.setItem("userVotes", JSON.stringify(updatedVotes));
    };

    return (
        <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-6 text-center">Your Joined Debates</h1>

            {joinedDebates.length === 0 ? (
                <p className="text-gray-600 text-center">You haven’t joined any debates yet.</p>
            ) : (
                <ul className="space-y-6">
                    {joinedDebates.map((debate, index) => {
                        // Show all arguments in the same debate
                        const relatedArgs = argumentsList.filter(
                            (arg) => arg.debateId === debate.debateId
                        );

                        // For now, no countdown or isClosed logic, so assume debate is open
                        const isClosed = false;

                        return (
                            <li key={index} className="border rounded p-4 bg-gray-50">
                                <p><strong>Name:</strong> {debate.name}</p>
                                <p><strong>Debate ID:</strong> {debate.debateId}</p>
                                <p><strong>Side:</strong> {debate.side}</p>
                                <p className="text-sm text-gray-500">
                                    <strong>Joined at:</strong> {new Date(debate.joinedAt).toLocaleString()}
                                </p>

                                {/* Removed countdown display */}

                                {relatedArgs.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="font-semibold mb-2">Arguments in This Debate:</h3>
                                        <ul className="space-y-2">
                                            {relatedArgs.map((arg) => (
                                                <li
                                                    key={arg.id}
                                                    className="border p-3 rounded bg-white shadow-sm"
                                                >
                                                    {editingId === arg.id ? (
                                                        <>
                                                            <textarea
                                                                className="w-full p-2 border rounded mb-2"
                                                                value={editText}
                                                                onChange={(e) => setEditText(e.target.value)}
                                                            />
                                                            <div className="flex justify-end space-x-2">
                                                                <button
                                                                    onClick={() => setEditingId(null)}
                                                                    className="text-gray-500 hover:underline"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => handleSaveEdit(arg.id)}
                                                                    className="text-green-600 hover:underline"
                                                                >
                                                                    Save
                                                                </button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-sm text-gray-800">{arg.text}</p>
                                                            <div className="flex justify-between items-center text-xs mt-2 text-gray-500">
                                                                <span>By: {arg.name}</span>
                                                                <span>{new Date(arg.timestamp).toLocaleString()}</span>
                                                            </div>

                                                            <div className="flex justify-between items-center mt-1 text-sm">
                                                                <span>Votes: {arg.votes}</span>
                                                                <div className="flex gap-3">
                                                                    {!userVotes[arg.id] && !isClosed && (
                                                                        <button
                                                                            onClick={() => handleVote(arg.id, isClosed)}
                                                                            className="text-purple-600 hover:underline"
                                                                        >
                                                                            Vote
                                                                        </button>
                                                                    )}
                                                                    {canEdit(arg.timestamp) && (
                                                                        <>
                                                                            <button
                                                                                onClick={() => handleEdit(arg.id, arg.text)}
                                                                                className="text-blue-500 hover:underline"
                                                                            >
                                                                                Edit
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDelete(arg.id)}
                                                                                className="text-red-500 hover:underline"
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="mt-4 text-right">
                                    <button
                                        onClick={() =>
                                            handlePostArgument(debate.debateId, debate.side, debate.name, isClosed)
                                        }
                                        className={`text-blue-600 cursor-pointer text-sm font-medium ${isClosed ? "opacity-50 cursor-not-allowed" : "hover:text-blue-800"
                                            }`}
                                        disabled={isClosed}
                                    >
                                        Post your argument
                                    </button>
                                </div>
                            </li>
                        );
                    })}
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
