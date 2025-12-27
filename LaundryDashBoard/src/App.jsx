import React, { useEffect, useState } from 'react';
import "./App.css"
import { supabase } from '../SupabaseClient';

export default function App(){
  // --- Navigation State ---
  const [view, setView] = useState('home');

  // --- Data State with Dummy Data ---
  const [pending, setPending] = useState([]);
  
  const [mismatched, setMismatched] = useState([
    // { id: "STU-0988", name: "Arjun Mehta", count: 5, flagTime: "08:30 AM" },
    // { id: "STU-0992", name: "Sanya Kapoor", count: 3, flagTime: "08:45 AM" }
  ]);
  
  const [inProgress, setInProgress] = useState([
    // { id: "STU-1010", name: "Karan Johar", count: 8, startTime: "10:15 AM" },
    // { id: "STU-1015", name: "Ishita Bhalla", count: 15, startTime: "10:40 AM" }
  ]);
  
  const [completed, setCompleted] = useState([
    // { id: "STU-0850", name: "Zoya Akhtar", count: 10, finishTime: "07:30 AM" },
    // { id: "STU-0865", name: "Rohan Mehra", count: 4, finishTime: "08:15 AM" }
  ]);

  const [searchQuery, setSearchQuery] = useState("");


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

useEffect(()=>fetchDet,[])







  // --- Logic Handlers ---
  const handleAction = (item, action) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (action === 'wash') {
      setInProgress([...inProgress, { ...item, startTime: time }]);
      setPending(pending.filter(i => i.id !== item.id));
      setMismatched(mismatched.filter(i => i.id !== item.id));
    } else if (action === 'mismatch') {
      setMismatched([...mismatched, { ...item, flagTime: time }]);
      setPending(pending.filter(i => i.id !== item.id));
    } else if (action === 'complete') {
      setCompleted([...completed, { ...item, finishTime: time }]);
      setInProgress(inProgress.filter(i => i.id !== item.id));
    } else if (action === 'collect') {
      setCompleted(completed.filter(i => i.id !== item.id));
    }
  };

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
              <span className="id-label">{item.Unique_ID}</span>
              <span className="qty-badge">{item.Cloth_Count} PCS</span>
            </div>
            <div className="name-label">{item.User_Name}</div>
            <div className="actions">
              <button className="btn-primary" onClick={() => handleAction(item, 'wash')}>Start Wash</button>
              <button className="btn-secondary" onClick={() => handleAction(item, 'mismatch')}>Mismatch</button>
            </div>
          </div>
        ))}
        {filteredPending.length === 0 && <div className="empty">All caught up! No pending requests.</div>}
      </div>
    </div>
  );

  const renderDiscrepancy = () => (
    <div className="view-container">
      <div className="section-title">Count Discrepancies</div>
      <div className="list-container">
        {mismatched.map(item => (
          <div className="list-item" key={item.id}>
            <div className="item-info">
              <div className="id-label">{item.Unique_ID}</div>
              <div className="name-label">{item.User_Name}</div>
              <div className="timestamp-label">Flagged: {item.created_at} | Qty: {item.Cloth_Count}</div>
            </div>
            <button className="btn-primary btn-fixed" onClick={() => handleAction(item, 'wash')}>Resolve & Start Wash</button>
          </div>
        ))}
        {mismatched.length === 0 && <div className="empty">No active discrepancies.</div>}
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
              <div className="name-label">Name:{item.User_Name}</div>
              <div className="timestamp-label">Machine Start: {item.created_at} | Qty: {item.Cloth_Count}</div>
            </div>
            <button className="btn-secondary btn-fixed" onClick={() => handleAction(item, 'complete')}>Mark as Done</button>
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
              <td>{item.created_at}</td>
              <td className="text-right">
                <button className="btn-success btn-fixed" onClick={() => handleAction(item, 'collect')}>Collected</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {completed.length === 0 && <div className="empty">No items waiting for collection.</div>}
    </div>
  );

  return (
    <div className="app-shell">
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
    </div>
  );
};