import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Mess({ student }) {
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);
  const userName = student.User_Name;

  const MEALS = ["morning", "afternoon", "night"];

  async function load() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Mess_Attendance")
      .select("*")
      .eq("User_Name", userName)
      .eq("Date", today);

    if (error) console.log(error);

    const map = {};
    (data || []).forEach((r) => (map[r.Meal_Type] = r));

    setRecords(map);
    setLoading(false);
  }

  async function toggle(meal) {
    const existing = records[meal];

    // if no row → create new opt-out
    if (!existing) {
      await supabase.from("Mess_Attendance").insert([
        {
          User_Name: userName,
          Date: today,
          Meal_Type: meal,
          Opt_Out: true,
        },
      ]);
    } else {
      // toggle true / false
      await supabase
        .from("Mess_Attendance")
        .update({ Opt_Out: !existing.Opt_Out })
        .eq("id", existing.id);
    }

    load();
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div>Loading…</div>;

  return (
    <div>
      <h2 className="section-title">Mess — Today</h2>

      {MEALS.map((meal) => {
  const r = records[meal];

  return (
    <div
      key={meal}
      className="item-card"
      style={{
        marginBottom: 12,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <div className="name-label">{meal.toUpperCase()}</div>

        <div style={{ fontSize: 13, color: "#64748b" }}>
          Status:{" "}
          <span style={{ fontWeight: 700 }}>
            {r?.Opt_Out ? "Opted Out" : "Eating"}
          </span>
        </div>
      </div>

      <button
        className="btn-primary"
        style={{ width: 140 }}
        onClick={() => toggle(meal)}
      >
        {r?.Opt_Out ? "JOIN" : "OPT-OUT"}
      </button>
    </div>
  );
})}

    </div>
  );
}
