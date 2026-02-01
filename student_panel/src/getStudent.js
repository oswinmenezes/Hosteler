import { supabase } from "./supabase";

export default async function getStudent(authId) {
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("auth_id", authId)
    .single();

  if (error) {
    console.error("Student fetch error:", error);
    return null;
  }

  return data;
}