"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, Input, Label } from "@/components/ui";
import { Clock, X } from "lucide-react";

interface SnoozeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: { days: number; reason?: string }) => void;
}

export default function SnoozeDialog({
  open,
  onOpenChange,
  onConfirm,
}: SnoozeDialogProps) {
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ days, reason: reason.trim() || undefined });
    setReason("");
    setDays(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Snooze Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="days">Days</Label>
            <Input
              id="days"
              type="number"
              min={1}
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value, 10) || 1)}
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2"
            >
              <X strokeWidth={1.5} className="h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Clock strokeWidth={1.5} className="h-4 w-4" />
              Snooze
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

