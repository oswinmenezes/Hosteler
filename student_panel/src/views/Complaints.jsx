import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Complaints({ student }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [list, setList] = useState([]);

  async function loadComplaints() {
    const { data } = await supabase
      .from("Complaints")
      .select("*")
      .eq("Registered_By", student.User_Name)
      .order("created_at", { ascending: false });

    setList(data || []);
  }

  async function submitComplaint(e) {
    e.preventDefault();

    await supabase.from("Complaints").insert([
      {
        Complaint_Title: title,
        Complaint_Description: desc,
        Registered_By: student.User_Name,
        Room_No: student.Room_No,
        Admin_Status: "pending",
        Student_Confirmation: null,
      },
    ]);

    setTitle("");
    setDesc("");

    loadComplaints();
  }

  async function confirmStatus(id, value) {
    await supabase
      .from("Complaints")
      .update({ Student_Confirmation: value })
      .eq("id", id);

    loadComplaints();
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  return (
    <div>
      <h2 className="section-title">Raise Complaint</h2>

      <form onSubmit={submitComplaint} className="item-card" style={{ marginBottom: 20 }}>
        <div className="form-group">
          <label>Complaint Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Example: Fan not working"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            required
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Explain the issue"
          />
        </div>

        <button className="btn-primary btn-full">Submit</button>
      </form>

      <h3 className="section-title">My Complaints</h3>

      {list.length === 0 && <div className="empty">No complaints yet</div>}

      {list.length > 0 && (
        <table className="collection-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Student Confirmation</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {list.map((c) => (
              <tr key={c.id}>
                <td>{c.Complaint_Title}</td>

                <td>{c.Admin_Status || "pending"}</td>

                <td>{c.Student_Confirmation || "—"}</td>

                <td>
                  {c.Admin_Status === "resolved" && !c.Student_Confirmation && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="btn-success"
                        onClick={() => confirmStatus(c.id, "resolved_ok")}
                      >
                        Yes, fixed
                      </button>

                      <button
                        className="btn-secondary"
                        onClick={() => confirmStatus(c.id, "not_resolved")}
                      >
                        Not resolved
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
