export default function StatsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="bg-white rounded-xl p-4 shadow-card">
        <div className="font-medium mb-2">Watering Frequency</div>
        <canvas id="wateringChart" className="w-full h-40"></canvas>
      </div>
    </div>
  );
}
