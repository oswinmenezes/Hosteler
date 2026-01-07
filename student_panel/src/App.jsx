import { useEffect, useState } from "react";
import { supabase } from "./supabase";

import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Layout from "./Layout/Layout";
import getStudent from "./getStudent";

import Laundry from "./views/Laundry";
import StudentChatbot from "./views/StudentChatbot";


export default function App() {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [view, setView] = useState("login"); // login | signup

  // listen to auth session changes
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // load student info when logged in
  useEffect(() => {
    if (user) {
      getStudent(user.id).then(setStudent);
    } else {
      setStudent(null);
    }
  }, [user]);

  function handleLogout() {
    supabase.auth.signOut();
  }

  // Not logged in → show login / signup
if (!user) {
  return view === "login" ? (
    <Login
      onLogin={setUser}
      onSwitch={(view) => setView(view)}
    />
  ) : (
    <Signup
      onSwitch={(view) => setView(view)}
    />
  );
}


  // // logged in but student record missing
  // if (!student) return <div>Loading profile…</div>;

  return <Layout student={student} onLogout={handleLogout} />;
}
