export const generateFromLocal = async (prompt: string) => {
    const res = await fetch("/api/ai/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
        throw new Error("Tier 2 Local Generation Failed");
    }
    const data = await res.json();
    return data.result;
};
