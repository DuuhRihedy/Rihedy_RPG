import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function verifyKeys() {
  const keys = await prisma.aiApiKey.findMany({ where: { active: true } });
  console.log(`Verificando ${keys.length} keys...\n`);
  
  for (const key of keys) {
    if (key.provider === "gemini") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key.apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "teste" }] }]
        })
      });
      if (!res.ok) {
        const error = await res.text();
        console.log(`[Gemini] ${key.label}: ${res.status} HTTP -> ${error.substring(0, 150)}`);
      } else {
        console.log(`[Gemini] ${key.label}: OK!`);
      }
    } else if (key.provider === "groq") {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key.apiKey}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: "teste" }]
        })
      });
      if (!res.ok) {
        const error = await res.text();
        console.log(`[Groq] ${key.label}: ${res.status} HTTP -> ${error.substring(0, 150)}`);
      } else {
         console.log(`[Groq] ${key.label}: OK!`);
      }
    }
  }
}
verifyKeys().finally(() => prisma.$disconnect());
