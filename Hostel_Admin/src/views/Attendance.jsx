import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { QRCodeCanvas } from "qrcode.react";

export default function Attendance() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sessionName, setSessionName] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  async function loadSessions() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Attendance_Sessions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setSessions(data || []);
    setLoading(false);
  }

  async function createSession() {
    if (!sessionName) return alert("Enter session name");

    const random = Math.random().toString(36).substring(2, 10);

    await supabase.from("Attendance_Sessions").insert({
      Session_Name: sessionName,
      Session_Date: date,
      QR_Code_Value: random,
      Is_Active: true,
    });

    setSessionName("");
    loadSessions();
  }

  async function stopSession(id) {
    await supabase
      .from("Attendance_Sessions")
      .update({ Is_Active: false })
      .eq("id", id);

    loadSessions();
  }

  useEffect(() => {
    loadSessions();
  }, []);

  return (
    <>
      <h2 className="section-title">Attendance (QR)</h2>

      {/* Create Session */}
      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          marginBottom: 24,
        }}
      >
        <h4>Create Session</h4>

        <div style={{ display: "flex", gap: 12 }}>
          <input
            type="text"
            placeholder="Session Name (ex: Morning)"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            className="search-box"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="search-box"
            style={{ width: 160 }}
          />

          <button className="btn-primary" onClick={createSession}>
            Create
          </button>
        </div>
      </div>

      {/* Sessions List */}
      {loading && <div>Loading…</div>}

      {!loading && sessions.length === 0 && (
        <div className="empty">No sessions created</div>
      )}

      {!loading && sessions.length > 0 && (
        <div className="incoming-grid">
          {sessions.map((s) => (
            <div key={s.id} className="item-card">
              <div className="card-top">
                <span className="id-label">
                  #{s.id}
                </span>

                <span className="qty-badge">
                  {s.Is_Active ? "ACTIVE" : "CLOSED"}
                </span>
              </div>

              <div className="name-label">
                {s.Session_Name} — {s.Session_Date}
              </div>

              <div style={{ textAlign: "center", marginBottom: 10 }}>
                <QRCodeCanvas
                  value={`${s.id}:${s.QR_Code_Value}`}
                  size={120}
                />
              </div>

              <div className="actions">
                {s.Is_Active && (
                  <button
                    className="btn-secondary"
                    onClick={() => stopSession(s.id)}
                  >
                    Stop Session
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
