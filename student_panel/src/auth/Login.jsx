import { useState } from "react";
import { supabase } from "../supabase";

export default function Login({ onSwitch, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    onLogin(data.user);
  }

  return (
    <div className="login-screen">
      <div className="login-card">

        <h1>Login</h1>
        <p>Use your registered email and password.</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn-primary btn-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* SIGN UP LINK */}
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          Don’t have an account?{" "}
          <span
            style={{ color: "#2563eb", cursor: "pointer", fontWeight: 600 }}
            onClick={() => onSwitch("signup")}
          >
            Sign up
          </span>
        </div>

      </div>
    </div>
  );
}
