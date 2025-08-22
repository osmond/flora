import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Droplet, ImageIcon, Sun } from "lucide-react";

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-background p-6 space-y-12">
      <header>
        <h1 className="text-3xl font-headline font-semibold tracking-tight">Flora Style Guide Preview</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          All components styled according to the app's visual system.
        </p>
      </header>

      {/* Buttons */}
      <section>
        <h2 className="text-xl font-headline font-semibold mb-2">Buttons</h2>
        <div className="flex gap-4 flex-wrap">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* Form Inputs */}
      <section>
        <h2 className="text-xl font-headline font-semibold mb-2">Form Elements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input placeholder="Plant name" />
          <Input placeholder="Scientific name" />
          <Textarea placeholder="Notes about this plant..." />
          <div className="flex items-center gap-2">
            <label htmlFor="indoor" className="text-sm">Indoor</label>
            <Switch id="indoor" />
          </div>
        </div>
      </section>

      {/* Cards */}
      <section>
        <h2 className="text-xl font-headline font-semibold mb-2">Card Example</h2>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Monstera Deliciosa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Droplet className="w-4 h-4" /> Water every 7 days
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Sun className="w-4 h-4" /> Bright, indirect light
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <CalendarClock className="w-4 h-4" /> Last watered 2 days ago
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Badges */}
      <section>
        <h2 className="text-xl font-headline font-semibold mb-2">Badges</h2>
        <div className="flex gap-2 flex-wrap">
          <Badge>New</Badge>
          <Badge variant="secondary">Indoor</Badge>
          <Badge variant="outline">Bright Light</Badge>
        </div>
      </section>
    </div>
  );
}
