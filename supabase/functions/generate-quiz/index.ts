import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { subject, topic, difficulty, numQuestions, quizType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let formatInstruction = "";
    if (quizType === "MCQ") {
      formatInstruction = `Each question must have exactly 4 options. Return JSON array: [{"q":"question text","options":["A","B","C","D"],"correct":0}] where correct is the 0-based index of the right answer.`;
    } else if (quizType === "True/False") {
      formatInstruction = `Each question must have exactly 2 options: ["True","False"]. Return JSON array: [{"q":"question text","options":["True","False"],"correct":0}] where correct is 0 for True, 1 for False.`;
    } else {
      formatInstruction = `Return JSON array: [{"q":"question text","answer":"correct answer text"}] for short answer questions.`;
    }

    const topicPart = topic ? ` specifically about "${topic}"` : "";
    const prompt = `Generate exactly ${numQuestions} ${difficulty} difficulty ${quizType} questions on the subject "${subject}"${topicPart}.

${formatInstruction}

Rules:
- Questions MUST be about "${subject}"${topicPart} ONLY. Do not generate questions about anything else.
- Difficulty level: ${difficulty}
- Return ONLY valid JSON array, no markdown, no explanation, no extra text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a quiz generator. You ONLY return valid JSON arrays. No markdown code blocks, no explanations." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    
    // Strip markdown code blocks if present
    content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    
    const questions = JSON.parse(content);

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-quiz error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
