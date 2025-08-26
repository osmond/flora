'use client'

import { useEffect, useState } from 'react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface CareNudgeProps {
  plantId: string
}

export default function CareNudge({ plantId }: CareNudgeProps) {
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    async function fetchSuggestion() {
      try {
        const res = await fetch(`/api/ai-care?plantId=${plantId}`)
        const json = await res.json()
        if (Array.isArray(json.suggestions) && json.suggestions.length > 0) {
          setSuggestion(json.suggestions[0] as string)
        }
      } catch {
        // ignore errors
      }
    }
    fetchSuggestion()
  }, [plantId])

  async function sendFeedback(feedback: string) {
    try {
      await fetch('/api/care-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plant_id: plantId, feedback }),
      })
    } catch {
      // ignore errors
    }
  }

  async function handleApply() {
    await sendFeedback('applied')
    setHidden(true)
  }

  async function handleDismiss() {
    await sendFeedback('dismissed')
    setHidden(true)
  }

  if (!suggestion || hidden) return null

  return (
    <Alert className="border-l-4 border-emerald-500 bg-emerald-50">
      <AlertTitle>AI Suggestion</AlertTitle>
      <AlertDescription className="text-muted-foreground">
        {suggestion}
      </AlertDescription>
      <div className="mt-2 flex gap-2">
        <Button size="sm" onClick={handleApply}>
          Apply
        </Button>
        <Button size="sm" variant="outline" onClick={handleDismiss}>
          Dismiss
        </Button>
      </div>
    </Alert>
  )
}
