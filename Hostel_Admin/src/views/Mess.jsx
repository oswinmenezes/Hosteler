import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Mess() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(today);
  const [meal, setMeal] = useState("lunch");

  async function loadData() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Mess_Attendance")
      .select("*")
      .eq("Date", date)
      .eq("Meal_Type", meal)
      .order("created_at", { ascending: false });

    if (!error) setList(data || []);
    setLoading(false);
  }

  async function toggleOptOut(id, value) {
    await supabase
      .from("Mess_Attendance")
      .update({ Opt_Out: value })
      .eq("id", id);

    loadData();
  }

  useEffect(() => {
    loadData();
  }, [date, meal]);

  return (
    <>
      <h2 className="section-title">Mess Attendance</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="search-box"
          style={{ width: "180px" }}
        />

        <select
          value={meal}
          onChange={(e) => setMeal(e.target.value)}
          className="search-box"
          style={{ width: "160px" }}
        >
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="night">Night</option>

        </select>
      </div>

      {/* Summary */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Opted Out</span>
          <div className="stat-value">
            {list.filter((x) => x.Opt_Out === true).length}
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-label">Eating</span>
          <div className="stat-value">
            {list.filter((x) => x.Opt_Out === false).length}
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total</span>
          <div className="stat-value">{list.length}</div>
        </div>
      </div>

      {/* Table */}
      {loading && <div>Loading…</div>}

      {!loading && list.length === 0 && (
        <div className="empty">No records found</div>
      )}

      {!loading && list.length > 0 && (
        <table className="collection-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Meal</th>
              <th>Status</th>
              <th>Toggle</th>
            </tr>
          </thead>

          <tbody>
            {list.map((row) => (
              <tr key={row.id}>
                <td>{row.User_Name}</td>
                <td>{row.Meal_Type}</td>

                <td>
                  {row.Opt_Out ? "Not Eating" : "Eating"}
                </td>

                <td style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="btn-secondary"
                    onClick={() => toggleOptOut(row.id, false)}
                  >
                    Eating
                  </button>

                  <button
                    className="btn-primary"
                    onClick={() => toggleOptOut(row.id, true)}
                  >
                    Not Eating
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
