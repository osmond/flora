import { NextResponse } from 'next/server';

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o-mini';

// Simple in-memory LRU cache for species queries
const CACHE_LIMIT = 100;
const speciesCache = new Map<string, string[]>();

function getCached(query: string) {
  const cached = speciesCache.get(query);
  if (!cached) return null;
  // refresh key to mark as recently used
  speciesCache.delete(query);
  speciesCache.set(query, cached);
  return cached;
}

function setCached(query: string, names: string[]) {
  speciesCache.set(query, names);
  if (speciesCache.size > CACHE_LIMIT) {
    const oldestKey = speciesCache.keys().next().value;
    speciesCache.delete(oldestKey);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json([]);
  }

  const cached = getCached(query);
  if (cached) {
    return NextResponse.json(cached);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OPENAI_API_KEY is not configured; returning empty species list');
    return NextResponse.json([]);
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

    setCached(query, names);
    return NextResponse.json(names);
  } catch (err) {
    console.error('Species search failed', err);
    return NextResponse.json(
      { error: 'Species search failed' },
      { status: 500 }
    );
  }
}

