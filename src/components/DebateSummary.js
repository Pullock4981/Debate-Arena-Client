'use client';

import { useEffect, useState } from 'react';

export default function DebateSummary({ debateId, createdAt, duration }) {
    const [summary, setSummary] = useState(null);
    const [isClosed, setIsClosed] = useState(false);

    useEffect(() => {
        if (!createdAt || !duration) return;

        const endTime = new Date(createdAt).getTime() + duration * 60 * 1000;
        const now = Date.now();
        setIsClosed(now > endTime);

        if (now < endTime) return;

        const allArguments = JSON.parse(localStorage.getItem("arguments") || "[]");
        const debateArguments = allArguments.filter(arg => arg.debateId === debateId);

        const supportVotes = debateArguments
            .filter(arg => arg.side === "Support")
            .reduce((acc, curr) => acc + (curr.votes || 0), 0);

        const opposeVotes = debateArguments
            .filter(arg => arg.side === "Oppose")
            .reduce((acc, curr) => acc + (curr.votes || 0), 0);

        const mockSummary = `This debate had ${debateArguments.length} arguments. Support received ${supportVotes} votes, and Oppose received ${opposeVotes}. ${supportVotes === opposeVotes
                ? 'It was a balanced and thoughtful debate.'
                : supportVotes > opposeVotes
                    ? 'Support side presented stronger arguments.'
                    : 'Oppose side made more compelling points.'
            }`;

        setSummary({
            totalArgs: debateArguments.length,
            supportVotes,
            opposeVotes,
            winner:
                supportVotes === opposeVotes
                    ? "Draw"
                    : supportVotes > opposeVotes
                        ? "Support"
                        : "Oppose",
            mockSummary,
        });
    }, [debateId, createdAt, duration]);

    if (!isClosed || !summary) return null;

    return (
        <div className="bg-yellow-100 p-4 mt-10 rounded shadow-md">
            <h2 className="text-xl font-bold mb-2">📝 Debate Summary</h2>
            <p><strong>Total Arguments:</strong> {summary.totalArgs}</p>
            <p><strong>Support Votes:</strong> {summary.supportVotes}</p>
            <p><strong>Oppose Votes:</strong> {summary.opposeVotes}</p>
            <p className="mt-2 italic text-gray-700">{summary.mockSummary}</p>
            <p className="mt-2 text-blue-700 font-bold">🏆 Winner: {summary.winner}</p>
        </div>
    );
}
