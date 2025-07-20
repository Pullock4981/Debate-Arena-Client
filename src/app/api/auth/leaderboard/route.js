// app/api/leaderboard/route.js

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all";

    try {
        const response = await fetch(`http://localhost:5000/leaderboard?filter=${filter}`);

        if (!response.ok) {
            const error = await response.json();
            return new Response(JSON.stringify({ error: error.error || "Backend error" }), {
                status: response.status,
                headers: { "Content-Type": "application/json" },
            });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error proxying leaderboard request:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
