import { supabase } from "./supabase";

export default async function getStudent(email) {
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("email", email).eq("auth_id",uuid)
    .single();

  return data;
}
