"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function AddNoteForm({ plantId }: { plantId: string }) {
  const router = useRouter();
  const form = useForm<{ note: string }>({
    defaultValues: { note: "" },
  });

  const onSubmit = async ({ note }: { note: string }) => {
    if (!note.trim()) return;

    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plant_id: plantId, type: "note", note }),
    });

    form.reset();
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write a note..."
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          Add Note
        </Button>
      </form>
    </Form>
  );
}
