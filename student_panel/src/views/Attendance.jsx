import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Attendance({ student }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadSessions() {
    setLoading(true);

    const today = new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from("Attendance_Sessions")
      .select("*")
      .eq("Session_Date", today)
      .eq("Is_active", true);

    if (!error) setSessions(data || []);

    setLoading(false);
  }

  async function markPresent(session) {
    await supabase.from("Attendance").insert({
      User_Name: student.User_Name,
      Attendance: true,
      Session_Id: session.id,
      Scanned_At: new Date().toISOString(),
    });

    alert("Attendance marked!");
  }

  useEffect(() => {
    loadSessions();
  }, []);

  if (loading) return <div>Loading…</div>;

  return (
    <div>
      <h2 className="section-title">Attendance — Today</h2>

      {sessions.length === 0 && (
        <div className="empty">No active sessions right now.</div>
      )}

      {sessions.map((s) => (
        <div
          key={s.id}
          className="item-card"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div className="name-label">{s.Session_Name}</div>

            <div style={{ fontSize: 13, color: "#64748b" }}>
              Session Date: <b>{s.Session_Date}</b>
            </div>
          </div>

          <button
            className="btn-success"
            style={{ width: 160 }}
            onClick={() => markPresent(s)}
          >
            MARK PRESENT
          </button>
        </div>
      ))}
    </div>
  );
}
