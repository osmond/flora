import { cache } from "react";
import { supabaseAdmin } from "./supabaseAdmin";
import { getCurrentUserId } from "./auth";

export const getPlants = cache(async () => {
  const { data, error } = await supabaseAdmin
    .from("plants")
    .select("id, name, room, species, common_name, image_url")
    .eq("user_id", getCurrentUserId())
    .order("room")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data;
});

export const getTasks = cache(async () => {
  const { data, error } = await supabaseAdmin
    .from("tasks")
    .select("id, type, due_date, plant:plants(id, name)")
    .eq("user_id", getCurrentUserId())
    .order("due_date");

  if (error) {
    throw new Error(error.message);
  }

  return data;
});
