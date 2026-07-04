module.exports = {
  apps: [{
    name: "esggo",
    script: "npm",
    args: "run start",
    cwd: "/var/www/esggo",
    env: {
      NODE_ENV: "production",
      PORT: "3000",
      GROQ_API_KEY: process.env.GROQ_API_KEY || "",
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || ""
    }
  }]
};
