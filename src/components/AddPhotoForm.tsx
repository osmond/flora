"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

type FormValues = {
  photo: FileList;
  note: string;
};

export default function AddPhotoForm({ plantId }: { plantId: string }) {
  const router = useRouter();
  const form = useForm<FormValues>({
    defaultValues: {
      note: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const file = values.photo?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("plant_id", plantId);
    formData.append("type", "photo");
    formData.append("photo", file);
    if (values.note) formData.append("note", values.note);

    await fetch("/api/events", {
      method: "POST",
      body: formData,
    });

    form.reset();
    router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Photo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Photo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files)}
                      ref={field.ref}
                      name={field.name}
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
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Caption (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Upload</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
