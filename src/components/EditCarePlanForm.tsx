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

export default function EditCarePlanForm({
  plantId,
  initialCarePlan,
}: {
  plantId: string;
  initialCarePlan: {
    waterEvery?: string;
    fertEvery?: string;
    fertFormula?: string;
  } | null;
}) {
  const router = useRouter();
  const form = useForm<{
    waterEvery: string;
    fertEvery: string;
    fertFormula: string;
  }>({
    defaultValues: {
      waterEvery: initialCarePlan?.waterEvery || "",
      fertEvery: initialCarePlan?.fertEvery || "",
      fertFormula: initialCarePlan?.fertFormula || "",
    },
  });

  const onSubmit = async (data: {
    waterEvery: string;
    fertEvery: string;
    fertFormula: string;
  }) => {
    await fetch(`/api/plants/${plantId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        care_plan: {
          waterEvery: data.waterEvery || undefined,
          fertEvery: data.fertEvery || undefined,
          fertFormula: data.fertFormula || undefined,
        },
      }),
    });
    router.push(`/plants/${plantId}`);
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="waterEvery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Water every</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fertEvery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fertilize every</FormLabel>
              <FormControl>
                <Input type="text" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fertFormula"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fertilizer formula</FormLabel>
              <FormControl>
                <Input type="text" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          Save Care Plan
        </Button>
      </form>
    </Form>
  );
}
