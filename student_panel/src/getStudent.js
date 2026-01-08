import { supabase } from "./supabase";

export default async function getStudent(authId) {
  const { data } = await supabase
    .from("Users")
    .select("*")
    .eq("auth_id", authId)
    .single();

  return data;
}
