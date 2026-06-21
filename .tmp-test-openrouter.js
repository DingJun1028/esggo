const https = require("https");
const fs = require("fs");
const env = fs.readFileSync("/var/www/esggo/.env", "utf8");
const match = env.match(/OPENROUTER_API_KEY=(\S+)/);
const key = match ? match[1].trim() : "";

const body = JSON.stringify({
  model: "meta-llama/llama-3.3-70b-instruct:free",
  messages: [{ role: "user", content: "Say hello in one sentence." }],
  max_tokens: 50
});

const options = {
  hostname: "openrouter.ai",
  path: "/api/v1/chat/completions",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + key,
    "HTTP-Referer": "https://esggo.vercel.app",
    "X-Title": "ESGGO Test"
  }
};

console.log("Testing with key length:", key.length);
console.log("Key starts:", key.substring(0, 8));
const req = https.request(options, (res) => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    console.log("Status:", res.statusCode);
    console.log("Response:", data.substring(0, 500));
  });
});
req.on("error", e => console.log("Error:", e.message));
req.write(body);
req.end();
