import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function Page() {
  return (
    <div className="max-w-md mx-auto space-y-4 mt-8">
      <div className="space-y-2">
        <Label htmlFor="name">Nickname</Label>
        <Input id="name" placeholder="Kay" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="species">Species</Label>
        <Input id="species" placeholder="Search species..." />
      </div>

      <Button className="w-full">Create Plant</Button>
    </div>
  )
}
