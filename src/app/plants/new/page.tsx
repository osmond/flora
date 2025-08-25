import AddPlantForm from "@/components/plant/AddPlantForm"

export const metadata = {
  title: "Add Plant — Flora",
}

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Add a Plant</h1>
        <AddPlantForm />
      </div>
    </main>
  )
}
