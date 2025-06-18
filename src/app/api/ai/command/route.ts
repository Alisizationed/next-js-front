/* eslint-disable @typescript-eslint/prefer-includes */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const CHUNKING_REGEXPS = {
  line: /\n+/m,
  list: /.{8}/m,
  word: /\S+\s+/m,
};

type ChunkDetector = (buffer: string) => string | null | undefined;

export async function POST(req: NextRequest) {
  const { prompt, system, model = 'llama3.1:8b' } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
  }

  const ollamaUrl = process.env.OLLAMA_URL ?? 'http://localhost:13434';

  try {
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: system ? `${system}\n\n${prompt}` : prompt,
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      const errText = await response.text();
      return NextResponse.json({ error: errText }, { status: response.status });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const reader = response.body.getReader();

    // Detect chunk based on context (simplified for clarity)
    let isInCodeBlock = false;
    let isInTable = false;
    let isInList = false;
    let isInLink = false;

    function detectChunk(buffer: string): string | null {
      // Toggle code block state
      if (/```/.test(buffer)) {
        isInCodeBlock = !isInCodeBlock;
      }
      // Link detection (very rough)
      if (buffer.includes('http')) isInLink = true;
      if (buffer.includes('\n')) isInLink = false;

      if (buffer.includes('*') || buffer.includes('-')) isInList = true;
      if (buffer.includes('\n')) isInList = false;

      if (buffer.includes('|')) isInTable = true;
      if (buffer.includes('\n\n')) isInTable = false;

      let match;
      if (isInCodeBlock || isInTable || isInLink) {
        match = CHUNKING_REGEXPS.line.exec(buffer);
      } else if (isInList) {
        match = CHUNKING_REGEXPS.list.exec(buffer);
      } else {
        match = CHUNKING_REGEXPS.word.exec(buffer);
      }

      if (!match) return null;
      return buffer.slice(0, match.index + match[0].length);
    }

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Split lines, but keep incomplete line in buffer
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const json = JSON.parse(line);
              if (json.done) {
                controller.close();
                return;
              }

              const content: string = json.response ?? '';

              let innerBuffer = content;
              let chunk;

              while ((chunk = detectChunk(innerBuffer)) !== null) {
                controller.enqueue(encoder.encode(chunk));
                innerBuffer = innerBuffer.slice(chunk.length);

                // Delay more for code blocks or tables for smooth streaming
                const delay = isInCodeBlock || isInTable ? 100 : 30;
                await new Promise((r) => setTimeout(r, delay));
              }

              // Enqueue any remaining text
              if (innerBuffer.length > 0) {
                controller.enqueue(encoder.encode(innerBuffer));
              }
            } catch {
              // Ignore JSON parse errors (usually incomplete line)
            }
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        // Do NOT set Transfer-Encoding header manually in Edge runtime
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to stream response from Ollama' },
      { status: 500 }
    );
  }
}
