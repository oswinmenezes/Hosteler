import React, { useState } from 'react';
import { supabase } from '../supabase';

export default function Laundry({ activeOrder, setActiveOrder, logs, setLogs, student }) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const addLog = (action, value, currentStatus) => {
    const newLog = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: action,
      value: value,
      status: currentStatus
    };
    setLogs([newLog, ...logs]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const count = parseInt(inputValue) || 0;
    
    if (count <= 0) {
      alert("Please enter a valid number of clothes.");
      return;
    }

    setLoading(true);
    const orderId = `LND-${Date.now().toString().slice(-4)}`;

    try {
      // 1. Insert into Supabase
      const { error } = await supabase
        .from("Laundry")
        .insert([
          { 
            Unique_ID: student?.BID, 
            Cloth_Count: count, // Using the parsed integer
            User_Name: student?.full_name || student?.User_Name || 'Anonymous',
            
          }
        ]);

      if (error) throw error;

      // 2. Update Local State (only if DB insert succeeds)
      const newOrder = {
        id: orderId,
        totalClothes: count,
        status: student?.Status,
      };
      
      setActiveOrder(newOrder);
      addLog('Initial submission', count, 'Pending');
      setInputValue('');
      
    } catch (error) {
      console.error("Error inserting laundry:", error.message);
      alert("Failed to submit laundry: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async () => { // 1. Added async
  const count = parseInt(inputValue) || 0;
  
  if (count <= 0) {
    alert("Please enter a valid number.");
    return;
  }

  try {
    // 2. Update Supabase
    // We filter by Unique_ID AND ensure we only edit 'Pending' orders
    const { error } = await supabase
      .from("Laundry")
      .update({ Cloth_Count: count })
      .eq('Unique_ID', student?.BID)
      .eq('Status', 'Pending'); 

    if (error) throw error;

    // 3. Update Local UI State
    setActiveOrder({ ...activeOrder, totalClothes: count });
    addLog('Updated count', count, activeOrder.status);
    setIsEditing(false);
    setInputValue('');
    
    console.log("Update successful!");
  } catch (err) {
    console.error("Update failed:", err.message);
    alert("Could not update database: " + err.message);
  }
};

  const getStatusColor = (s) => {
    switch(s) {
      case 'Ready for Pick Up': return '#10b981';
      case 'Mismatch': return '#ef4444';
      case 'In Progress': return '#f59e0b';
      default: return '#2563eb';
    }
  };

  return (
    <div className="view-container">
      <h2 className="section-title">Laundry Management</h2>

      {!activeOrder ? (
        <div className="login-card" style={{ margin: '0 auto' }}>
          <h2>Laundry Entry</h2>
          <p>Enter the total number of clothes to begin</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Total Cloth Count</label>
              <input 
                type="number" 
                placeholder="0" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary btn-full" 
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Entry'}
            </button>
          </form>
        </div>
      ) : (
        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
          <div style={{ marginBottom: '10px' }}>
             <span className="id-label">ORDER ID: {activeOrder.id}</span>
          </div>
          
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-label">Total Clothes</span>
              {isEditing ? (
                <div className="form-group" style={{ marginTop: '10px' }}>
                  <input 
                    type="number" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)}
                    autoFocus
                  />
                  <div className="actions" style={{ marginTop: '10px' }}>
                    <button className="btn-success" onClick={handleEditSave}>Save</button>
                    <button className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="stat-value">{activeOrder.totalClothes}</div>
                  <button 
                    className="btn-secondary" 
                    style={{ marginTop: '12px', width: '100%' }} 
                    onClick={() => { setInputValue(activeOrder.totalClothes); setIsEditing(true); }}
                  >
                    Edit Count
                  </button>
                </>
              )}
            </div>

            <div className="stat-card">
              <span className="stat-label">Current Status</span>
              <div className="stat-value" style={{ fontSize: '20px', color: getStatusColor(activeOrder.status), marginBottom: '12px' }}>
                {activeOrder.status}
              </div>
            </div>
          </div>

          <h3 className="section-title">Activity Log</h3>
          <table className="collection-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Action</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.date} <span style={{ color: '#94a3b8', fontSize: '11px' }}>{log.time}</span></td>
                  <td>{log.action}</td>
                  <td className="id-label">{log.value}</td>
                  <td>
                    <span className="qty-badge" style={{ background: '#f1f5f9', color: getStatusColor(log.status) }}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}