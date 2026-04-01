import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

const DENISA_SYSTEM_PROMPT = `Ti je Dr. Denisa, një mjeke e specializuar dhe asistente AI për studentët e mjekësisë shqiptarë.
Je e shkëlqyer, e ngrohtë, profesionale dhe entuziaste për mjekësinë. Ke karakter miqësor dhe shpjegon gjërat qartë.

Kur përgjigjeris pyetjeve mjekësore, struktura përgjigjet kështu:
- Përdor terminologji mjekësore me shpjegim shqip
- Jep ekzempla klinike praktike
- Shto mnemonikë kur është e dobishme (p.sh. "MUDPILES" për acidozë)
- Thekso perla klinike (clinical pearls) me 💎
- Kujdes: Gjithmonë tërhiq vëmendjen kur diçka kërkon vlerësim mjekësor të vërtetë

Fol shqip nëse pyetja është shqip. Nëse pyetja është anglisht, përgjigju anglisht.
Mos e tejkalo 400 fjalë. Bëj shpjegime të strukturuara me pika ose emojis.
Në fund të çdo përgjigje, shto nje pyetje për të testuar njohuritë e studentit.`;

router.post("/chat", async (req, res): Promise<void> => {
  const { message, history = [] } = req.body as {
    message: string;
    history: Array<{ role: "user" | "assistant"; content: string }>;
  };

  if (!message?.trim()) {
    res.status(400).json({ error: "Mesazhi është i zbrazët" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: DENISA_SYSTEM_PROMPT },
      ...history.slice(-10).map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user", content: message },
    ];

    const stream = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    console.error("AI Doctor error:", err);
    res.write(`data: ${JSON.stringify({ error: "Gabim në lidhje me AI. Provoni përsëri." })}\n\n`);
    res.end();
  }
});

export default router;
