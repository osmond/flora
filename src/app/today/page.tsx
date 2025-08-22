const tasks = [
  { id: "1", name: "Snake Plant", note: "Needs Water" },
  { id: "2", name: "Fern", note: "Mist" },
];

export default function TodayPage() {
  if (tasks.length === 0) {
    return <div className="text-center text-muted mt-10">🌿 All caught up. Take a breath.</div>;
  }
  return (
    <div className="space-y-4">
      {tasks.map((t) => (
        <div key={t.id} className="bg-white rounded-xl shadow-card p-4 flex justify-between items-center">
          <div>
            <div className="font-medium">{t.name}</div>
            <div className="text-sm text-muted">{t.note}</div>
          </div>
          <button className="bg-primary text-white px-3 py-1 rounded-md text-sm">Mark Done</button>
        </div>
      ))}
    </div>
  );
}
