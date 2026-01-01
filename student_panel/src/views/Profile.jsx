export default function Profile({ student }) {
  return (
    <>
      <h2 className="section-title">Profile</h2>

      <div className="login-card" style={{ maxWidth: 500 }}>
        <p><b>Name:</b> {student.User_Name}</p>
        <p><b>Room:</b> {student.Room_No}</p>
        <p><b>Auth ID:</b> {student.auth_id}</p>
      </div>
    </>
  );
}
