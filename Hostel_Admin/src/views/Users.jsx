import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Users() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Users")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setList(data || []);

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <h2 className="section-title">Users</h2>

      {loading && <div>Loading…</div>}

      {!loading && list.length === 0 && (
        <div className="empty">No users found</div>
      )}

      {!loading && list.length > 0 && (
        <table className="collection-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Room No</th>
            </tr>
          </thead>

          <tbody>
            {list.map((row) => (
              <tr key={row.id}>
                <td>{row.User_Name}</td>
                <td>{row.Room_No}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
