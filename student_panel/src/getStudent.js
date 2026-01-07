import { supabase } from "./supabase";

export default async function getStudent(email) {
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("email", email).eq("auth_id",uuid)
    .single();

  if (error) {
    console.error("Student fetch error:", error);
    return null;
  }

  return data;
}
