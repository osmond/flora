"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Room = { id: number; name: string }

export function RoomSelect(props: {
  id?: string;
  value?: number | null;
  onChange: (roomId: number | null) => void;
}) {
  const { id, value = null, onChange } = props;
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [newRoom, setNewRoom] = React.useState<string>("");
  const [creating, setCreating] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/rooms");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) setRooms(data as Room[]);
      } catch {}
    })();
  }, []);

  async function createRoom() {
    if (!newRoom.trim()) return;
    setCreating(true);
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newRoom.trim() }),
    });
    const json = await res.json().catch(() => ({}));
    setCreating(false);
    if (res.ok && json?.room) {
      setRooms((r) => [...r, json.room].sort((a, b) => a.name.localeCompare(b.name)));
      onChange(json.room.id);
      setNewRoom("");
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Room</Label>
      <Select
        value={value !== null ? String(value) : "0"}
        onValueChange={(v) => onChange(v === "0" ? null : Number(v))}
      >
        <SelectTrigger id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">No room</SelectItem>
          {rooms.map((r) => (
            <SelectItem key={r.id} value={String(r.id)}>
              {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Input
          className="flex-1"
          placeholder="Quick add room…"
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
        />
        <Button type="button" onClick={createRoom} disabled={creating}>
          {creating ? "Adding…" : "Add"}
        </Button>
      </div>
    </div>
  );
}
