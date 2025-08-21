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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddPhotoForm({ plantId }: { plantId: string }) {
  const router = useRouter();
  const form = useForm<{ photo: FileList | null; note: string }>({
    defaultValues: { photo: null, note: "" },
  });

  const onSubmit = async ({ photo, note }: { photo: FileList | null; note: string }) => {
    if (!photo || photo.length === 0) return;

    const formData = new FormData();
    formData.append("plant_id", plantId);
    formData.append("type", "photo");
    formData.append("photo", photo[0]);
    if (note) formData.append("note", note);

    await fetch("/api/events", {
      method: "POST",
      body: formData,
    });

    form.reset();
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-700"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Caption (optional)"
                  className="text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          Add Photo
        </Button>
      </form>
    </Form>
  );
}
