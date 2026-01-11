import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Layout from './Layout/Layout';
import Login from './auth/Login';
import Signup from './auth/Signup';

export default function App() {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [view, setView] = useState("login");
  
  const [activeOrder, setActiveOrder] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Step ahead: Load everything related to the user
        loadUserData(session.user.email);
      } else {
        setUser(null);
        setStudent(null);
        setActiveOrder(null);
        setLogs([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // One function to load Profile, Active Laundry, and Logs
  const loadUserData = async (email) => {
    try {
      // 1. Fetch Student Profile
      const { data: profile, error: profileErr } = await supabase
        .from("Users")
        .select("*")
        .eq('email', email)
        .maybeSingle();

      if (profileErr) throw profileErr;
      if (profile) {
        setStudent(profile);

        // 2. Fetch Active Laundry Order (Step Ahead)
        const { data: order } = await supabase
          .from("Laundry")
          .select("*")
          .eq("Unique_ID", profile.BID)
          .in("Status", ["Pending", "In Progress", "Ready for Pick Up"])
          .order('id', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (order) {
          setActiveOrder({
            id: `LND-${order.id.toString().slice(-4)}`,
            totalClothes: order.Cloth_Count,
            status: order.Status,
          });
        }

        // 3. Fetch History Logs (Step Ahead)
        const { data: history } = await supabase
          .from("Laundry")
          .select("*")
          .eq("Unique_ID", profile.BID)
          .order('created_at', { ascending: false });

        if (history) {
          const formattedLogs = history.map(item => ({
            id: item.id,
            date: new Date(item.created_at).toLocaleDateString(),
            time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            action: item.Status === 'Pending' ? 'Initial submission' : 'Status Update',
            value: item.Cloth_Count,
            status: item.Status
          }));
          setLogs(formattedLogs);
        }
      }
    } catch (err) {
      console.error("Error loading user data:", err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!user) {
    return view === "login" ? <Login setView={setView} /> : <Signup setView={setView} />;
  }

  if (!student) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Loading SJEC Profile...</h2>
      </div>
    );
  }

  return (
    <Layout 
      user={user}
      student={student}
      onLogout={handleLogout}
      activeOrder={activeOrder}
      setActiveOrder={setActiveOrder}
      logs={logs}
      setLogs={setLogs}
    />
  );
}