import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

import Dashboard from "../views/Dashboard";
import Complaints from "../views/Complaints";
import Mess from "../views/Mess";
import Gym from "../views/Gym";
import Attendance from "../views/Attendance";
import Profile from "../views/Profile";

export default function Layout({ student, onLogout }) {
  const [view, setView] = useState("dashboard");

  return (
    <div className="app-shell">
      <Sidebar current={view} setCurrent={setView} />

      <main>
        <Header student={student} onLogout={onLogout} />

        {/* PAGE CONTENT */}
        {view === "dashboard" && <Dashboard student={student} />}
        {view === "complaints" && <Complaints student={student} />}
        {view === "mess" && <Mess student={student} />}
        {view === "gym" && <Gym student={student} />}
        {view === "attendance" && <Attendance student={student} />}
        {view === "profile" && <Profile student={student} />}
      </main>
    </div>
  );
}
