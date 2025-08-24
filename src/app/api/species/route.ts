import { NextResponse } from 'next/server';

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o-mini';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json([]);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not configured' },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are a botanical assistant that returns plant species names as a JSON array.',
          },
          {
            role: 'user',
            content: `List up to 10 plant species names that match "${query}". Return a JSON array of strings.`,
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch species' },
        { status: res.status }
      );
    }

    type OpenAIResponse = {
      choices?: {
        message?: {
          content?: string;
        };
      }[];
    };

    const data = (await res.json()) as OpenAIResponse;
    const content = data.choices?.[0]?.message?.content ?? '[]';
    let names: string[] = [];
    try {
      names = JSON.parse(content);
    } catch {
      // fallback if model returns non-JSON
      names = content
        .split(/[,\n]/)
        .map((s) => s.replace(/^[\s"'-]+|[\s"'-]+$/g, ''))
        .filter(Boolean)
        .slice(0, 10);
    }

    return NextResponse.json(names);
  } catch (err) {
    console.error('Species search failed', err);
    return NextResponse.json(
      { error: 'Species search failed' },
      { status: 500 }
    );
  }
}

