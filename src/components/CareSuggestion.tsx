'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface CareSuggestionProps {
  plantId: string;
}

export default function CareSuggestion({ plantId }: CareSuggestionProps) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    async function fetchSuggestion() {
      try {
        const res = await fetch(`/api/ai-care?plantId=${plantId}`);
        const json = await res.json();
        if (Array.isArray(json.suggestions) && json.suggestions.length > 0) {
          setSuggestion(json.suggestions[0] as string);
        }
      } catch {
        // ignore errors
      }
    }
    fetchSuggestion();
  }, [plantId]);

  async function sendFeedback(feedback: string) {
    try {
      await fetch('/api/care-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plant_id: plantId, feedback }),
      });
    } catch {
      // ignore errors
    }
  }

  async function handleApply() {
    await sendFeedback('applied');
    setHidden(true);
  }

  async function handleDismiss() {
    await sendFeedback('dismissed');
    setHidden(true);
  }

  if (!suggestion || hidden) return null;

  return (
    <div className="rounded-md border-l-4 border-emerald-500 bg-emerald-50 p-4 text-sm">
      <p className="font-medium">AI Suggestion</p>
      <p className="text-muted-foreground">{suggestion}</p>
      <div className="mt-2 flex gap-2">
        <Button size="sm" onClick={handleApply}>Apply</Button>
        <Button size="sm" variant="outline" onClick={handleDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}

