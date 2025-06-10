/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type NextRequest, NextResponse } from 'next/server';

interface OllamaResponse {
  response: string;
}

export async function POST(req: NextRequest) {
  const {
    prompt,
    model = 'llama3.1',
    temperature = 0.8,
    system,
  } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Missing prompt.' }, { status: 400 });
  }

  const ollamaUrl = process.env.OLLAMA_URL ?? 'http://localhost:11434';

  try {
    const tempNum =
      typeof temperature === 'number' ? temperature : parseFloat(String(temperature));
    const temperatureFinal = isNaN(tempNum) ? 0.8 : tempNum;

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt: system ? `${system}\n\n${prompt}` : prompt,
        temperature: temperatureFinal,
        stream: false,
      }),
      signal: req.signal,
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }

    const result = (await response.json()) as OllamaResponse;

    return NextResponse.json({ text: result.response.trim() });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(null, { status: 408 });
    }

    return NextResponse.json(
      { error: 'Failed to process LLaMA request' },
      { status: 500 }
    );
  }
}
