import React, { useEffect, useState } from 'react';
import "./App.css"
import { supabase } from '../SupabaseClient';
import Login from './Login';

export default function App(){
  const [session,setSession]=useState(null)
  // --- Navigation State ---
  const [view, setView] = useState('home');
  // --- Data State with Dummy Data ---
  const [pending, setPending] = useState([]);
  
  const [mismatched, setMismatched] = useState([]);
  
  const [inProgress, setInProgress] = useState([]);
  
  const [completed, setCompleted] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");


  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  async function fetchDet(){
    const{data,error}=await supabase.from("Laundry").select("*");
    if(error){
      console.log(error.message)
      return
    }
    console.log(data)
    setPending(data.filter(d=>d.Status==="Pending"))
    setMismatched(data.filter(d=>d.Status==="Mismatch"))
    setInProgress(data.filter(d=>d.Status==="InProgress"))
    setCompleted(data.filter(d=>d.Status==="Completed"))

  }

  useEffect(()=>{
    fetchDet()
  },[])

  useEffect(()=>{
    async function getCurrSession() {
      const{data,error}=await supabase.auth.getSession()
      if(error){
        console.log("failed to get session :",error.message)
        return
      }
      console.log("data :",data)
      setSession(data.session)
    }
    getCurrSession()
  },[])






  // --- Logic Handlers ---
  async function handleAction(item, action){
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if(action==="pickup"){
      const {data,error}=await supabase.from("Laundry").delete().eq("Unique_ID",item.Unique_ID)
      if(error){
        console.log(error.message)
        return
      }
    }
    else{
      const {data,error}=await supabase.from("Laundry").update({"Status":action,"Time":time}).eq("Unique_ID",item.Unique_ID)
      if(error){
        console.log(error.message)
        return
      }
    }
    console.log("Update Successfull")
    fetchDet();
  };

  async function handleSaveEdit(item) {
    if (!editValue || isNaN(editValue)) return;
    
    const { error } = await supabase
      .from("Laundry")
      .update({ "Cloth_Count": parseInt(editValue) })
      .eq("Unique_ID", item.Unique_ID);

    if (error) {
      console.log("Error updating count:", error.message);
      return;
    }

    setEditingId(null);
    fetchDet();
  }


  const filteredPending = pending.filter(p => 
    p.Unique_ID.includes(searchQuery.toLowerCase()) ||
    p.User_Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Render Functions ---
  const renderHome = () => (
    <div className="view-container">
      <div className="stats-row">
        <div className="stat-card" onClick={() => setView('discrepancy')}>
          <span className="stat-label">Discrepancy</span>
          <span className="stat-value text-red">{mismatched.length}</span>
        </div>
        <div className="stat-card" onClick={() => setView('processing')}>
          <span className="stat-label">Processing</span>
          <span className="stat-value text-blue">{inProgress.length}</span>
        </div>
        <div className="stat-card" onClick={() => setView('collection')}>
          <span className="stat-label">Ready</span>
          <span className="stat-value text-green">{completed.length}</span>
        </div>
      </div>

      <div className="section-title">Incoming Requests Queue</div>
      <div className="incoming-grid">
        {filteredPending.map(item => (
          <div className="item-card" key={item.id}>
            <div className="card-top">
              <span className="id-label">UID:{item.Unique_ID}</span>
              <span className="qty-badge">{item.Cloth_Count} PCS</span>
            </div>
            <div className="name-label">{item.User_Name}</div>
            <div className="actions">
              <button className="btn-primary" onClick={() => handleAction(item, 'InProgress')}>Start Wash</button>
              <button className="btn-secondary" onClick={() => handleAction(item, 'Mismatch')}>Mismatch</button>
            </div>
          </div>
        ))}
        {filteredPending.length === 0 && <div className="empty">All caught up! No pending requests.</div>}
      </div>
    </div>
  );

  const renderDiscrepancy = () => (
    <div className="view-container">
      <div style={{ fontWeight: '700', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Count Discrepancies</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {mismatched.map(item => (
          <div key={item.id} style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '4px' }}>UID:{item.Unique_ID}</div>
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>{item.User_Name}</div>
              
              {editingId === item.Unique_ID ? (
                <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="number" 
                    style={{ width: '80px', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    value={editValue} 
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                  />
                  <button style={{ padding: '6px 12px', background: '#2563eb', color: 'white', borderRadius: '6px', border: 'none', fontSize: '0.875rem' }} onClick={() => handleSaveEdit(item)}>Save</button>
                  <button style={{ padding: '6px 12px', background: '#f1f5f9', borderRadius: '6px', border: 'none', fontSize: '0.875rem' }} onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  Flagged: {item.Time} | Qty: <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{item.Cloth_Count}</span>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {editingId !== item.Unique_ID && (
                <button 
                  style={{ padding: '0.5rem 1rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                  onClick={() => {
                    setEditingId(item.Unique_ID);
                    setEditValue(item.Cloth_Count);
                  }}
                >
                  Edit Qty
                </button>
              )}
              <button 
                style={{ padding: '0.5rem 1rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                onClick={() => handleAction(item, 'InProgress')}
              >
                Start Wash
              </button>
            </div>
          </div>
        ))}
        {mismatched.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', border: '2px dashed #e2e8f0', borderRadius: '12px', color: '#64748b' }}>No active discrepancies.</div>}
      </div>
    </div>
  );


  const renderProcessing = () => (
    <div className="view-container">
      <div className="section-title">Processing Queue (In Washing)</div>
      <div className="list-container">
        {inProgress.map(item => (
          <div className="list-item" key={item.id}>
            <div className="item-info">
              <div className="id-label">UID:{item.Unique_ID}</div>
              <div className="name-label">{item.User_Name}</div>
              <div className="timestamp-label">Machine Start: {item.Time} | Qty: {item.Cloth_Count}</div>
            </div>
            <button className="btn-secondary btn-fixed" onClick={() => handleAction(item, 'Completed')}>Mark as Done</button>
          </div>
        ))}
        {inProgress.length === 0 && <div className="empty">Washers are currently empty.</div>}
      </div>
    </div>
  );

  const renderCollection = () => (
    <div className="view-container">
      <div className="section-title">Ready for Collection</div>
      <table className="collection-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Qty</th>
            <th>Finished</th>
            <th className="text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {completed.map(item => (
            <tr key={item.id}>
              <td className="id-label">{item.Unique_ID}</td>
              <td className="font-semibold">{item.User_Name}</td>
              <td>{item.Cloth_Count} Pcs</td>
              <td>{item.Time}</td>
              <td className="text-right">
                <button className="btn-success btn-fixed" onClick={() => handleAction(item, 'pickup')}>Collected</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {completed.length === 0 && <div className="empty">No items waiting for collection.</div>}
    </div>
  );

  return (
    session?<div className="app-shell">
      <aside>
        <div className="logo">KapikadLion Laundry </div>
        <nav>
          <div className={`nav-item ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>
            <span>Home Dashboard</span>
          </div>
          <div className={`nav-item ${view === 'discrepancy' ? 'active' : ''}`} onClick={() => setView('discrepancy')}>
            <span>Discrepancy</span>
            <span className="nav-badge">{mismatched.length}</span>
          </div>
          <div className={`nav-item ${view === 'processing' ? 'active' : ''}`} onClick={() => setView('processing')}>
            <span>Processing</span>
            <span className="nav-badge">{inProgress.length}</span>
          </div>
          <div className={`nav-item ${view === 'collection' ? 'active' : ''}`} onClick={() => setView('collection')}>
            <span>Ready / Collection</span>
            <span className="nav-badge">{completed.length}</span>
          </div>
        </nav>
      </aside>

      <main>
        <header>
          <div className="header-title">
            {view === 'home' && "Operations Overview"}
            {view === 'discrepancy' && "Discrepancy Management"}
            {view === 'processing' && "Washing Queue"}
            {view === 'collection' && "Collection Terminal"}
          </div>
          <input 
            className="search-box" 
            type="text"
            placeholder="Search student or code..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </header>

        <section className="content-area">
          {view === 'home' && renderHome()}
          {view === 'discrepancy' && renderDiscrepancy()}
          {view === 'processing' && renderProcessing()}
          {view === 'collection' && renderCollection()}
        </section>
      </main>
    </div>:<Login setSession={setSession} />
  );
};