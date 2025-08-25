import AddPlantForm from "@/components/plant/AddPlantForm"

export const metadata = {
  title: "Add Plant — Flora",
}

export default function AddPlantPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Add a Plant</h1>
        <AddPlantForm />
      </div>
    </main>
  )
}
