export default function Login() {
  return (
    <div className="login-screen">
      <div className="login-card">

        <div className="logo-center">Hostel Admin</div>

        <h2>Welcome back 👋</h2>
        <p>Sign in to continue to the dashboard</p>

        <div className="form-group">
          <label>Admin Email</label>
          <input type="email" placeholder="admin@example.com" />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••" />
        </div>

        <button className="btn-primary btn-full">
          Login
        </button>

      </div>
    </div>
  );
}
