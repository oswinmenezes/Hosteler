import { supabase } from "../SupabaseClient";
import { useState } from "react";

export default function Login({ setSession }) { // ✅ get setSession from props
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  async function handleSubmit() { // ✅ no destructuring here
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password
      });

      if (error) {
        console.log("Supabase sign-in failed:", error.message);
        return;
      }

      console.log("Sign-in successful");
      console.log(data);
      setSession(data.session); // ✅ now works
    } catch (error) {
      console.log("Sign-in Failed:", error.message);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="logo-center">LAUNDRY PRO</div>
        <h2>Welcome Back</h2>
        <p>Please enter your details to sign in</p>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="admin@laundrypro.com"
            required
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            required
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
        </div>

        <button type="button" className="btn-primary btn-full" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
