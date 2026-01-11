import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

import Dashboard from "../views/Dashboard";
import Complaints from "../views/Complaints";
import Mess from "../views/Mess";
import Gym from "../views/Gym";
import Attendance from "../views/Attendance";
import Profile from "../views/Profile";
import Laundry from "../views/Laundry";
import StudentChatbot from "../views/StudentChatbot";

// Added the missing props from App.jsx here
export default function Layout({ 
  student, 
  onLogout, 
  activeOrder, 
  setActiveOrder, 
  logs, 
  setLogs 
}) {
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
        
        {/* LAUNDRY VIEW with PERSISTENT STATE */}
        {view === 'laundry' && (
            <Laundry 
              student={student} // Pass student to Laundry so it can use student.id for Supabase
              activeOrder={activeOrder} 
              setActiveOrder={setActiveOrder} 
              logs={logs} 
              setLogs={setLogs} 
            />
        )}

        {view === "chatbot" && <StudentChatbot />}

      </main>
    </div>
  );
}