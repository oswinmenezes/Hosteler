import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase";
import { Html5Qrcode } from "html5-qrcode";

export default function Attendance({ student }) {
  const [sessions, setSessions] = useState([]);
  const [isScannerStarted, setIsScannerStarted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [scannedSessionName, setScannedSessionName] = useState("");
  const scannerRef = useRef(null);

  useEffect(() => {
    loadSessions();
    // Pre-initialize the scanner instance
    scannerRef.current = new Html5Qrcode("reader");

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => { });
      }
    };
  }, []);

  const startScanning = async () => {
    setErrorMsg("");
    try {
      // FORCE TRIGGER: This forces the browser to show the permission popup
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // Stop the test stream immediately so the scanner can take over
      stream.getTracks().forEach(track => track.stop());

      // Now start the actual scanner
      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // Parse the QR code JSON string
          let sessionObj;
          try {
            sessionObj = JSON.parse(decodedText);
          } catch (e) {
            setErrorMsg("Invalid QR code format.");
            scannerRef.current.stop().catch(() => { });
            setIsScannerStarted(false);
            return;
          }

          setScannedSessionName(sessionObj.session_name);

          // Find session in attendance_ledger and update
          updateAttendanceLedger(sessionObj.session_id, student.User_Name);

          scannerRef.current.stop().catch(() => { }); // Stop scanner after successful scan
          setIsScannerStarted(false); // Hide scanner UI
        }
      );
      setIsScannerStarted(true);
    } catch (err) {
      console.error(err);
      setErrorMsg("Camera Access Denied or Not Found. Check site settings.");
    }
  };

  async function loadSessions() {
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase.from("Attendance_Sessions").select("*").eq("Session_Date", today).eq("Is_active", true);
    setSessions(data || []);
  }

  async function markPresent(sessionId) {
    const { error } = await supabase.from("Attendance").insert({
      User_Name: student.User_Name, Attendance: true, Session_Id: sessionId, Scanned_At: new Date().toISOString(),
    });
    if (!error) alert("Success!");
  }

  async function updateAttendanceLedger(session_id, student_id) {
    const { error } = await supabase
      .from("attendence_ledger")
      .update({ is_used: true, student_id })
      .eq("session_id", session_id);
      if(error){
        console.log(error)

      }
    if (!error) alert("Attendance marked!");
  }

  return (
    <div style={{ padding: '20px', maxWidth: '450px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Attendance Scanner</h2>

      <div id="reader" style={{
        width: '100%',
        borderRadius: '20px',
        boxShadow: '0 4px 24px rgba(37,99,235,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '10px',
        transition: 'min-height 0.3s',
        border: isScannerStarted ? '3px solid #2563eb' : 'none',
        overflow: 'hidden',
        position: 'relative',
        padding: isScannerStarted ? '20px' : '0px',
      }}></div>

      {!isScannerStarted && (
        <div style={{ textAlign: 'center', padding: '40px 20px', border: '2px dashed #ccc', borderRadius: '15px' }}>
          <button
            onClick={startScanning}
            style={{ padding: '15px 30px', fontSize: '16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Open Camera
          </button>
          {errorMsg && <p style={{ color: 'red', marginTop: '10px' }}>{errorMsg}</p>}
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <div style={{ color: '#2563eb', fontWeight: 'bold', marginBottom: '10px' }}>
          Scanned Session: {scannedSessionName}
        </div>
        {sessions.map(s => <div key={s.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{s.Session_Name}</div>)}
      </div>
    </div>
  );
}