export default function Sidebar({ current, setCurrent }) {
  const items = [
    { key: "dashboard", label: "Dashboard" },
    { key: "complaints", label: "Complaints" },
    { key: "mess", label: "Mess" },
    { key: "gym", label: "Gym" },
    { key: "attendance", label: "Attendance" },
    { key: "users", label: "Users" }
  ];

  return (
    <aside>
      <div className="logo">Hostel Admin</div>

      {items.map((item) => (
        <div
          key={item.key}
          className={`nav-item ${current === item.key ? "active" : ""}`}
          onClick={() => setCurrent(item.key)}
        >
          {item.label}
        </div>
      ))}
    </aside>
  );
}
