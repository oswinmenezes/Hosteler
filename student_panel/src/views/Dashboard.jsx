export default function Dashboard({ student }) {
  return (
    <div className="view-container">
      <h2 className="section-title">Welcome 👋</h2>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Name</span>
          <div className="stat-value">{student?.User_Name}</div>
        </div>

        <div className="stat-card">
          <span className="stat-label">Room</span>
          <div className="stat-value">{student?.Room_No}</div>
        </div>
      </div>
    </div>
  );
}
