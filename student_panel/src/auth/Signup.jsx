import { useState } from "react";
import { supabase } from "../supabase";

export default function Signup({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          room
        }
      }
    });

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "Account created. Please check your email and confirm to continue."
    );
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <h2>Create Account</h2>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="error-message">{message}</div>}

        <form onSubmit={handleSignup}>
          <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
          <input placeholder="Room No" value={room} onChange={e => setRoom(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />

          <button className="btn-primary btn-full">Create Account</button>
        </form>

        <p style={{ textAlign: "center", marginTop: 12 }}>
          Already have an account?{" "}
          <span style={{ color: "#2563eb", cursor: "pointer" }} onClick={() => onSwitch("login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
