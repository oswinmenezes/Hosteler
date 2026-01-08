import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase";
import { QRCodeCanvas } from "qrcode.react";

export default function Attendance() {
  const [createdSession, setCreatedSession] = useState(null);
  const [sessionName, setSessionName] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const sessionIdRef = useRef(null);

  useEffect(() => {
    let subscription;
    if (createdSession) {
      
      console.log("hii");
      sessionIdRef.current = createdSession.session_id;
      subscription = supabase
        .channel("schema-db-changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
          },
          (payload) => {
            console.log(payload);
            const row = payload.new;
            if (row.is_used) {
              // Create new session with same name
              createSessionWithSameName();
            }
          }
        )
        .subscribe();
    }
    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [createdSession]);

  async function createSession() {
    if (!sessionName) return alert("Enter session name");

    // Generate a random 7-digit session ID
    const sessionId = Math.floor(1000000 + Math.random() * 9000000).toString();
    const session_obj = {
      session_id: sessionId,
      session_name: sessionName,
    };
    const jsonValue = JSON.stringify(session_obj);

    await supabase.from("Attendance_Sessions").insert({
      Session_Name: sessionName,
      Session_Date: date,
      QR_Code_Value: jsonValue, // Store the JSON as the value
      Is_Active: true,
    });

    await addAttendanceLedgerEntry(sessionId, sessionName);

    setCreatedSession(session_obj);
    setSessionName("");
  }

  async function createSessionWithSameName() {
    const newSessionId = Math.floor(
      1000000 + Math.random() * 9000000
    ).toString();
    const session_obj = {
      session_id: newSessionId,
      session_name: createdSession.session_name,
    };
    const jsonValue = JSON.stringify(session_obj);
    await supabase.from("Attendance_Sessions").insert({
      Session_Name: createdSession.session_name,
      Session_Date: date,
      QR_Code_Value: jsonValue,
      Is_Active: true,
    });
    await addAttendanceLedgerEntry(newSessionId, createdSession.session_name);
    setCreatedSession(session_obj);
  }

  async function addAttendanceLedgerEntry(session_id, session_name) {
    const { error } = await supabase.from("attendence_ledger").insert({
      session_id,
      session_name,
    });

    console.log(error);
  }

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

      {createdSession && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 40,
          }}
        >
          <div style={{ marginBottom: 16 }}>
            Session ID: {createdSession.session_name}
          </div>
          <div style={{ marginBottom: 16 }}>Session QR Code:</div>

          <QRCodeCanvas value={JSON.stringify(createdSession)} size={180} />
        </div>
      )}
    </>
  );
}
