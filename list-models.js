import fetch from "node-fetch";

const key = process.env.GEMINI_API_KEY || "AIzaSyCDo_WCBU5HoxV-gRX_jRQtYyGEI6VHPuk";

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
const data = await res.json();

console.log("✅ Available models:");
data.models.forEach((m) => console.log(m.name));
