'use client';

import { useEffect, useState } from 'react';

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const rawData = JSON.parse(localStorage.getItem('debateVotes')) || [];

        const now = new Date();
        let filtered = [...rawData];

        if (filter === 'weekly') {
            filtered = filtered.filter(item => {
                const diff = (now - new Date(item.timestamp)) / (1000 * 60 * 60 * 24);
                return diff <= 7;
            });
        } else if (filter === 'monthly') {
            filtered = filtered.filter(item => {
                const diff = (now - new Date(item.timestamp)) / (1000 * 60 * 60 * 24);
                return diff <= 30;
            });
        }

        const userStats = {};

        filtered.forEach(entry => {
            const { username, votes = 0, debateId } = entry;

            if (!userStats[username]) {
                userStats[username] = {
                    username,
                    totalVotes: 0,
                    debates: new Set(),
                };
            }

            userStats[username].totalVotes += votes;
            userStats[username].debates.add(debateId);
        });

        const formatted = Object.values(userStats).map(user => ({
            username: user.username,
            totalVotes: user.totalVotes,
            totalDebates: user.debates.size,
        }));

        formatted.sort((a, b) => b.totalVotes - a.totalVotes);

        setLeaderboard(formatted);
    }, [filter]);

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">🏆 Leaderboard</h1>

            <div className="mb-6">
                <button
                    onClick={() => setFilter('weekly')}
                    className={`px-4 py-2 mr-2 rounded ${filter === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                    Weekly
                </button>
                <button
                    onClick={() => setFilter('monthly')}
                    className={`px-4 py-2 mr-2 rounded ${filter === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                    Monthly
                </button>
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                    All Time
                </button>
            </div>

            {leaderboard.length === 0 ? (
                <p className="text-gray-500">No data found.</p>
            ) : (
                <table className="w-full table-auto border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2 text-left">User</th>
                            <th className="border px-4 py-2 text-left">Votes</th>
                            <th className="border px-4 py-2 text-left">Debates</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((user, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">{user.username}</td>
                                <td className="border px-4 py-2">{user.totalVotes}</td>
                                <td className="border px-4 py-2">{user.totalDebates}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
