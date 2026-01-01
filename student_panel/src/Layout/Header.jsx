import { supabase } from "../supabase";

export default function Header() {
  async function logout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  return (
    <header>
      <h3>Student Portal</h3>
      <button onClick={logout}>Logout</button>
    </header>
  );
}
