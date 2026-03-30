import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function testKeys() {
  const keys = await prisma.aiApiKey.findMany({
    where: { provider: "gemini", active: true },
    select: { id: true, label: true, apiKey: true, blockedUntil: true },
  });

  console.log(`Testando ${keys.length} keys Gemini...\n`);

  for (const key of keys) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key.apiKey}`;
    
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Diga oi em 3 palavras" }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 20 },
        }),
      });

      if (res.ok) {
        const data = await res.json() as any;
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "sem resposta";
        console.log(`✅ ${key.label}: OK → "${text.trim()}"`);
      } else {
        const err = await res.text();
        console.log(`❌ ${key.label}: ${res.status} → ${err.substring(0, 200)}`);
      }
    } catch (e: any) {
      console.log(`❌ ${key.label}: ERRO → ${e.message}`);
    }

    // Pequena pausa
    await new Promise(r => setTimeout(r, 2000));
  }

  // Groq test
  const groqKeys = await prisma.aiApiKey.findMany({
    where: { provider: "groq", active: true },
    select: { label: true, apiKey: true },
  });

  for (const key of groqKeys) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key.apiKey}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: "Diga oi" }],
          max_tokens: 10,
        }),
      });

      if (res.ok) {
        const data = await res.json() as any;
        console.log(`✅ Groq/${key.label}: OK → "${data.choices[0].message.content}"`);
      } else {
        const err = await res.text();
        console.log(`❌ Groq/${key.label}: ${res.status} → ${err.substring(0, 200)}`);
      }
    } catch (e: any) {
      console.log(`❌ Groq/${key.label}: ERRO → ${e.message}`);
    }
  }
}

testKeys()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
