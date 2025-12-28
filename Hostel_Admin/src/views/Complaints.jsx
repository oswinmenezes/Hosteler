import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Complaints() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadComplaints() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Complaints")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setList(data);
    console.log(data);
    console.log(error);
    console.log("ENV KEY:", import.meta.env.VITE_SUPABASE_KEY);
    setLoading(false);
  }

  async function updateStatus(id, status) {
    await supabase
      .from("Complaints")
      .update({ Admin_Status: status })
      .eq("id", id);

    loadComplaints();
  }

  useEffect(() => {
    loadComplaints();

    const channel = supabase
      .channel("complaints-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Complaints" },
        loadComplaints
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  if (loading) return <div>Loading…</div>;

  return (
    <>
      <h2 className="section-title">Complaints</h2>

      {list.length === 0 && <div className="empty">No complaints found</div>}

      {list.length > 0 && (
        <table className="collection-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Room</th>
              <th>Admin Status</th>
              <th>Student Reply</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.map((c) => (
              <tr key={c.id}>
                <td>{c.Complaint_Title}</td>
                <td>{c.Room_No}</td>
                <td>{c.Admin_Status || "pending"}</td>
                <td>{c.Student_Confirmation || "—"}</td>

                <td style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="btn-secondary"
                    onClick={() => updateStatus(c.id, "pending")}
                  >
                    Pending
                  </button>

                  <button
                    className="btn-primary"
                    onClick={() => updateStatus(c.id, "in_progress")}
                  >
                    In-Progress
                  </button>

                  <button
                    className="btn-success"
                    onClick={() => updateStatus(c.id, "resolved")}
                  >
                    Resolved
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
