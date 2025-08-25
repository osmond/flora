"use client";

import * as React from "react";

type Room = { id: number; name: string }

export function RoomSelect(props: {
  value?: number | null;
  onChange: (roomId: number | null) => void;
}) {
  const { value = null, onChange } = props;
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [newRoom, setNewRoom] = React.useState<string>("");
  const [creating, setCreating] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      if (Array.isArray(data)) setRooms(data as Room[]);
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
    const json = await res.json();
    setCreating(false);
    if (res.ok && json?.room) {
      setRooms((r) => [...r, json.room].sort((a, b) => a.name.localeCompare(b.name)));
      onChange(json.room.id);
      setNewRoom("");
    }
  }

  return (
    <div className="space-y-2">
      <select
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
      >
        <option value="">No room</option>
        {rooms.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <input
          className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="Quick add room…"
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
        />
        <button
          type="button"
          onClick={createRoom}
          disabled={creating}
          className="h-10 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {creating ? "Adding…" : "Add"}
        </button>
      </div>
    </div>
  );
}
