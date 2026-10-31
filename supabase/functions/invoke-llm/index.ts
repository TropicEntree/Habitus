// Supabase Edge Function: replaces Base44 `integrations.Core.InvokeLLM`.
//
// The browser never sees the Anthropic key: it is stored as a Supabase secret
// (ANTHROPIC_API_KEY). Supabase checks the user's login token before this
// function runs (verify_jwt is on by default), so only signed-in users can
// call it.
//
// Request body:  { prompt: string, response_json_schema?: object }
// Response body: a string, or the JSON object that matches the schema.

import Anthropic from "npm:@anthropic-ai/sdk";

const MODEL = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-opus-5-5";
const MAX_PROMPT_CHARS = 20_000;

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Structured outputs need every object to list `required` and forbid extra keys.
function strictSchema(schema: any): any {
  if (!schema || typeof schema !== "object") return schema;
  const out: any = { ...schema };
  if (out.type === "object" && out.properties) {
    out.properties = Object.fromEntries(
      Object.entries(out.properties).map(([k, v]) => [k, strictSchema(v)]),
    );
    out.required = Object.keys(out.properties);
    out.additionalProperties = false;
  }
  if (out.type === "array" && out.items) out.items = strictSchema(out.items);
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  let body: { prompt?: unknown; response_json_schema?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }

  const prompt = typeof body.prompt === "string" ? body.prompt : "";
  if (!prompt || prompt.length > MAX_PROMPT_CHARS) {
    return json({ error: "prompt missing or too long" }, 400);
  }
  const schema =
    body.response_json_schema && typeof body.response_json_schema === "object"
      ? strictSchema(body.response_json_schema)
      : null;

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 2000,
      output_config: {
        effort: "low",
        ...(schema ? { format: { type: "json_schema", schema } } : {}),
      },
      messages: [{ role: "user", content: prompt }],
    } as Anthropic.MessageCreateParamsNonStreaming);

    if (response.stop_reason === "refusal") {
      return json({ error: "request declined" }, 422);
    }

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    if (schema) {
      try {
        return json(JSON.parse(text));
      } catch {
        return json({ error: "model returned invalid JSON" }, 502);
      }
    }
    return json(text);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return json({ error: "rate limited, retry later" }, 429);
    }
    if (error instanceof Anthropic.APIError) {
      console.error("Anthropic API error", error.status, error.message);
      return json({ error: "AI service error" }, 502);
    }
    console.error("Unexpected error", error);
    return json({ error: "internal error" }, 500);
  }
});
