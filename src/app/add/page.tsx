export default function AddPlantPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-card space-y-6">
        <label className="block text-sm text-muted">Plant Name</label>
        <input className="w-full border border-gray-200 rounded-md p-2" />
      </div>
    </div>
  );
}
