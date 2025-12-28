import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Gym() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Gym")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setList(data || []);

    setLoading(false);
  }

  async function changeStatus(id, status) {
    await supabase
      .from("Gym")
      .update({ Status: status })
      .eq("id", id);

    loadData();
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <h2 className="section-title">Gym Management</h2>

      {loading && <div>Loading…</div>}

      {!loading && list.length === 0 && (
        <div className="empty">No records found</div>
      )}

      {!loading && list.length > 0 && (
        <table className="collection-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.map((row) => (
              <tr key={row.id}>
                <td>{row.User_Name}</td>

                <td>
                  {row.Status === "active" ? "Active" : "Inactive"}
                </td>

                <td style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="btn-success"
                    onClick={() => changeStatus(row.id, "active")}
                  >
                    Activate
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => changeStatus(row.id, "inactive")}
                  >
                    Deactivate
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
