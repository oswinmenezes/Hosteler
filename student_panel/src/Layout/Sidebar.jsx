export default function Sidebar({ current, setCurrent }) {
  const menu = [
    ["dashboard", "Dashboard"],
    ["complaints", "Complaints"],
    ["mess", "Mess"],
    ["gym", "Gym"],
    ["attendance", "Attendance"],
    ["profile", "Profile"],
  ];

  return (
    <aside>
      <div className="logo">Hostel Student</div>

      {menu.map(([key, label]) => (
        <div
          key={key}
          className={`nav-item ${current === key ? "active" : ""}`}
          onClick={() => setCurrent(key)}
        >
          {label}
        </div>
      ))}
    </aside>
  );
}
