import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Gym({ student }) {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    const today = new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from("Gym")
      .select("*")
      .eq("User_Name", student.User_Name)
      .gte("created_at", today)
      .order("created_at", { ascending: false })
      .limit(1);

    if (!error) setRecord(data?.[0] || null);

    setLoading(false);
  }

  async function toggle() {
    if (record?.Status === "Joined") {
      // cancel
      await supabase.from("Gym").insert({
        User_Name: student.User_Name,
        Status: "Cancelled",
      });
    } else {
      // join
      await supabase.from("Gym").insert({
        User_Name: student.User_Name,
        Status: "Joined",
      });
    }

    load();
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div>Loading…</div>;

  return (
    <div>
      <h2 className="section-title">Gym — Today</h2>

      <div
        className="item-card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div className="name-label">GYM ATTENDANCE</div>

          <div style={{ fontSize: 13, color: "#64748b" }}>
            Status:{" "}
            <span style={{ fontWeight: 700 }}>
              {record?.Status || "Not Joined"}
            </span>
          </div>
        </div>

        <button
          className="btn-primary"
          style={{ width: 140 }}
          onClick={toggle}
        >
          {record?.Status === "Joined" ? "CANCEL" : "JOIN"}
        </button>
      </div>
    </div>
  );
}
