import { useState } from "react";
import { supabase } from "../supabase";

export default function Signup() {
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

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      setError(error.message);
      return;
    }

    // create profile row
    await supabase.from("Users").insert({
      auth_id: data.user.id,
      User_Name: name,
      Room_No: room
    });

    setMessage(
      "Account created. Please check your email and confirm before logging in."
    );
  }

  return (
  <div className="login-screen">
    <div className="login-card">
      <div className="logo-center">Hostel Portal</div>

      <h2>Create Account</h2>
      <p>Enter your details to register.</p>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="error-message">{message}</div>}

      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label>Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Room No</label>
          <input value={room} onChange={(e) => setRoom(e.target.value)} />
        </div>

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
          <label>Password (min 6)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn-primary btn-full">Create Account</button>
      </form>

      {/* 👇 THIS IS THE NEW PART */}
      <p style={{ marginTop: "16px", textAlign: "center" }}>
        Already have an account?{" "}
        <span
          style={{ color: "#2563eb", cursor: "pointer", fontWeight: 600 }}
          onClick={() => onSwitch("login")}
        >
          Login
        </span>
      </p>
    </div>
  </div>
);

}
