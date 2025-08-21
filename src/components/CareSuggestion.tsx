"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { toast } from "@/components/ui/sonner";

interface Props {
  plantId: string;
  suggestion: string;
}

export default function CareSuggestion({ plantId, suggestion }: Props) {
  const [submitted, setSubmitted] = useState(false);

  const sendFeedback = async (feedback: "helpful" | "not_helpful") => {
    try {
      await fetch("/api/care-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plant_id: plantId, feedback }),
      });
      setSubmitted(true);
      toast("Thanks for your feedback!");
    } catch (err) {
      console.error("Failed to send feedback:", err);
    }
  };

  return (
    <section className="rounded border-l-4 border-primary bg-accent p-4 text-sm text-primary">
      <h2 className="mb-1 font-semibold">Care Coach</h2>
      <p>{suggestion}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        AI-generated suggestion. Consult local experts for persistent or unusual issues.
      </p>
      {!submitted ? (
        <div className="mt-2 flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => sendFeedback("helpful")}>
            Helpful
          </Button>
          <Button size="sm" variant="secondary" onClick={() => sendFeedback("not_helpful")}>
            Not Helpful
          </Button>
        </div>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">Thanks for your feedback!</p>
      )}
    </section>
  );
}
