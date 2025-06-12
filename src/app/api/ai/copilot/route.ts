/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextRequest } from "next/server";

interface OllamaStreamChunk {
  response: string;
  done: boolean;
}

function extractJsonObjects(text: string): { objects: string[]; remainder: string } {
  const objects: string[] = [];
  let depth = 0;
  let startIndex = -1;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === "{") {
      if (depth === 0) {
        startIndex = i;
      }
      depth++;
    } else if (char === "}") {
      depth--;
      if (depth === 0 && startIndex !== -1) {
        const jsonStr = text.slice(startIndex, i + 1);
        objects.push(jsonStr);
        startIndex = -1;
      }
    }
  }

  // Anything after the last complete JSON object is the remainder
  if (depth === 0 && startIndex === -1) {
    const lastCloseIndex = text.lastIndexOf("}") + 1;
    return {
      objects,
      remainder: text.slice(lastCloseIndex),
    };
  }

  // If incomplete JSON at the end, keep it as remainder
  if (startIndex !== -1) {
    return {
      objects,
      remainder: text.slice(startIndex),
    };
  }

  return {
    objects,
    remainder: "",
  };
}

export async function POST(req: NextRequest) {
  const {
    messages,
    model = "llama3.1:8b",
    temperature = 0.8,
    system: frontendSystem,
  } = await req.json();

  const lastUserMessageContent = messages?.at(-1)?.content;
  const userPrompt = lastUserMessageContent;

  if (!userPrompt) {
    return new Response(
      JSON.stringify({ error: "Missing user prompt in messages." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const ollamaUrl = process.env.OLLAMA_URL ?? "https://localhost:8473";

  try {
    const tempNum =
      typeof temperature === "number"
        ? temperature
        : parseFloat(String(temperature));
    const temperatureFinal = isNaN(tempNum) ? 0.8 : tempNum;
    const cleanUserPrompt = userPrompt
      .replace(/<Reminder>[\s\S]*?<\/Reminder>\n?/g, "")
      .trim();

    const ollamaRequestBody: Record<string, any> = {
      model,
      prompt: cleanUserPrompt,
      temperature: temperatureFinal,
      stream: true,
    };

    if (frontendSystem) {
      ollamaRequestBody.system = frontendSystem;
    }

    const response = await fetch(`${ollamaUrl}/api/llama/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("authorization") ?? "",
      },
      body: JSON.stringify(ollamaRequestBody),
      signal: req.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({
          error: `Ollama error (${response.status}): ${errorText}`,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }

          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Extract complete JSON objects from buffer
            const { objects, remainder } = extractJsonObjects(buffer);
            buffer = remainder;

            for (const jsonStr of objects) {
              try {
                const chunk = JSON.parse(jsonStr) as OllamaStreamChunk;

                if (chunk.response) {
                  const streamPart = `0:"${chunk.response
                    .replace(/"/g, '\\"')
                    .replace(/\n/g, "\\n")}"\n`;
                  controller.enqueue(encoder.encode(streamPart));
                }

                if (chunk.done) {
                  controller.enqueue(encoder.encode("d:\n"));
                  controller.close();
                  return;
                }
              } catch (parseError) {
                console.error("Error parsing Ollama chunk:", parseError, "jsonStr:", jsonStr);
              }
            }
          }

          // If stream ends but not closed properly, close controller
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Vercel-AI-Data-Stream": "v1",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return new Response(null, { status: 408 });
    }

    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process AI request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
