import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [complaints, setComplaints] = useState(0);
  const [gymActive, setGymActive] = useState(0);
  const [messOptOut, setMessOptOut] = useState(0);
  const [sessionsToday, setSessionsToday] = useState(0);

  const today = new Date().toISOString().slice(0, 10);

  async function loadStats() {
    setLoading(true);

    // complaints still open
    const { count: cCount } = await supabase
      .from("Complaints")
      .select("*", { count: "exact", head: true })
      .neq("Admin_Status", "resolved");

    setComplaints(cCount || 0);

    // gym active users
    const { count: gCount } = await supabase
      .from("Gym")
      .select("*", { count: "exact", head: true })
      .eq("Status", "active");

    setGymActive(gCount || 0);

    // mess opt-out today
    const { count: mCount } = await supabase
      .from("Mess_Attendance")
      .select("*", { count: "exact", head: true })
      .eq("Date", today)
      .eq("Opt_Out", true);

    setMessOptOut(mCount || 0);

    // attendance sessions today
    const { count: sCount } = await supabase
      .from("Attendance_Sessions")
      .select("*", { count: "exact", head: true })
      .eq("Session_Date", today);

    setSessionsToday(sCount || 0);

    setLoading(false);
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <>
      <h2 className="section-title">Overview</h2>

      {loading && <div>Loading…</div>}

      {!loading && (
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Open Complaints</span>
            <div className="stat-value">{complaints}</div>
          </div>

          <div className="stat-card">
            <span className="stat-label">Gym Active</span>
            <div className="stat-value">{gymActive}</div>
          </div>

          <div className="stat-card">
            <span className="stat-label">Mess Opt-Out Today</span>
            <div className="stat-value">{messOptOut}</div>
          </div>

          <div className="stat-card">
            <span className="stat-label">Attendance Sessions Today</span>
            <div className="stat-value">{sessionsToday}</div>
          </div>
        </div>
      )}
    </>
  );
}
