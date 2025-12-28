import { useState } from "react";
import "./index.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./views/Dashboard";
import Complaints from "./views/Complaints";
import Mess from "./views/Mess";
import Gym from "./views/Gym";
import Attendance from "./views/Attendance";
import Users from "./views/Users";

function App() {
  const [view, setView] = useState("dashboard");

  function renderView() {
    switch (view) {
      case "complaints": return <Complaints />;
      case "mess": return <Mess />;
      case "gym": return <Gym />;
      case "attendance": return <Attendance />;
      case "users": return <Users />;
      default: return <Dashboard />;
    }
  }

  return (
    <div className="app-shell">
      <Sidebar current={view} setCurrent={setView} />

      <main>
        <Header title={view.toUpperCase()} />
        <div className="view-container">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default App;
