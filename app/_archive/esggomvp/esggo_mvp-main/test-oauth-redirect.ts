async function testOAuthPaths() {
    const baseUrl = "https://app.nocodebackend.com/api/user-auth";
    const instance = "54686_esg_go_userdb";
    const pathsToTest = [
        "/sign-in/oauth",
        "/sign-in/social"
    ];

    for (const p of pathsToTest) {
        console.log(`\n[TEST] POST ${p}...`);
        try {
            const res = await fetch(`${baseUrl}${p}?instance=${instance}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Database-Instance": instance
                },
                body: JSON.stringify({
                    provider: "google",
                    callbackURL: "http://localhost:3000/omni"
                }),
                redirect: "manual"
            });

            console.log(`Status: ${res.status}`);
            console.log(`Location Header: ${res.headers.get("location") || "None"}`);
            const text = await res.text();
            if (text) console.log(`Body: ${text}`);

        } catch (e) {
            console.error("Failed:", e);
        }
    }
}

testOAuthPaths();
