/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextRequest } from 'next/server';

interface OllamaStreamChunk {
  response: string;
  done: boolean;
}

export async function POST(req: NextRequest) {
  const {
    messages,
    model = 'llama3.1:8b',
    temperature = 0.8,
    system: frontendSystem,
  } = await req.json();

  const lastUserMessageContent = messages?.at(-1)?.content;
  const userPrompt = lastUserMessageContent;

  if (!userPrompt) {
    return new Response(JSON.stringify({ error: 'Missing user prompt in messages.' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const ollamaUrl = process.env.OLLAMA_URL ?? 'http://localhost:11434';

  try {
    const tempNum = typeof temperature === 'number' ? temperature : parseFloat(String(temperature));
    const temperatureFinal = isNaN(tempNum) ? 0.8 : tempNum;
    const cleanUserPrompt = userPrompt.replace(/<Reminder>[\s\S]*?<\/Reminder>\n?/g, '').trim();

    const ollamaRequestBody: Record<string, any> = {
      model,
      prompt: cleanUserPrompt,
      temperature: temperatureFinal,
      stream: true,
    };

    if (frontendSystem) {
      ollamaRequestBody.system = frontendSystem;
    }

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ollamaRequestBody),
      signal: req.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: `Ollama error (${response.status}): ${errorText}` }), { 
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
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
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.trim()) {
                try {
                  const chunk = JSON.parse(line) as OllamaStreamChunk;
                  
                  if (chunk.response) {
                    // Send in the exact format AI SDK expects for streaming
                    const streamPart = `0:"${chunk.response.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"\n`;
                    controller.enqueue(encoder.encode(streamPart));
                  }

                  if (chunk.done) {
                    // Send the finish marker
                    controller.enqueue(encoder.encode('d:\n'));
                    controller.close();
                    return;
                  }
                } catch (parseError) {
                  console.error('Error parsing Ollama chunk:', parseError, 'Line:', line);
                }
              }
            }
          }
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
      },
    });

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return new Response(null, { status: 408 });
    }

    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process AI request' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}