import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Stats = () => {
    const [dbStats, setDbStats] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // API Base URL
    const API_URL = "https://portfolio-backend-vnu1.onrender.com";

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/getstats`);
            setDbStats(res.data);
            
            const adminRes = await axios.get(`${API_URL}/admin/status`, { withCredentials: true });
            if (adminRes.status === 200) setIsAdmin(true);
        } catch (err) {
            setIsAdmin(false); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSave = async () => {
        const icon = prompt("Icon Name?", dbStats?.icon || "star");
        const exp = prompt("Experience?", dbStats?.experience || "0");
        const clie = prompt("Clients?", dbStats?.clients || "0");
        const proj = prompt("Projects?", dbStats?.projects || "0");
        const achi = prompt("Achievements?", dbStats?.achivements || "0");

        if (icon && exp && clie && proj && achi) {
            const payload = { 
                icon, 
                experience: Number(exp), 
                clients: Number(clie), 
                projects: Number(proj), 
                achivements: Number(achi) 
            };

            try {
                if (dbStats?._id) {
                    await axios.put(`${API_URL}/admin/stats/${dbStats._id}`, payload, { withCredentials: true });
                } else {
                    await axios.post(`${API_URL}/admin/stats`, payload, { withCredentials: true });
                }
                alert("Success!");
                fetchData();
            } catch (err) { alert("Failed! Login again."); }
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Delete stats permanently?")) {
            try {
                // YAHAN FIXED: Added API_URL
                await axios.delete(`${API_URL}/admin/stats/${dbStats._id}`, { withCredentials: true });
                alert("Deleted!");
                setDbStats(null);
                fetchData();
            } catch (err) { alert("Delete failed!"); }
        }
    };

    if (loading) return <div style={{color:'#fff', textAlign:'center', padding:'50px'}}>Loading...</div>;

    return (
        <section style={{ background: '#000', color: '#fff', padding: '100px 10%', borderTop: '1px solid #111' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                
                {isAdmin && (
                    <div style={{ marginBottom: '40px', display: 'flex', gap: '15px' }}>
                        <button onClick={handleSave} style={{ background: '#b31b1b', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {dbStats ? "✎ EDIT STATS" : "+ ADD STATS"}
                        </button>
                        {dbStats && (
                            <button onClick={handleDelete} style={{ background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}>
                                🗑 DELETE
                            </button>
                        )}
                    </div>
                )}

                {dbStats ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '50px' }}>
                        {/* Experience - Biggest */}
                        <div style={{ flex: '1', minWidth: '250px' }}>
                            <h1 style={{ fontSize: '9rem', margin: 0, fontWeight: 900, lineHeight: 1, letterSpacing: '-5px' }}>
                                {dbStats.experience}
                            </h1>
                            <p style={{ color: '#ff4d4d', fontSize: '14px', fontWeight: 800, letterSpacing: '2px', marginTop: '10px' }}>
                                YEARS OF<br />EXPERIENCE
                            </p>
                        </div>

                        {/* Other Stats Grid */}
                        <div style={{ display: 'flex', flex: '1.5', justifyContent: 'space-between', gap: '30px', flexWrap: 'wrap' }}>
                            <div>
                                <h2 style={{ fontSize: '4rem', margin: 0, fontWeight: 900 }}>{dbStats.clients}+</h2>
                                <p style={{ color: '#555', fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>GLOBAL CLIENTS</p>
                            </div>
                            <div>
                                <h2 style={{ fontSize: '4rem', margin: 0, fontWeight: 900 }}>{dbStats.projects}+</h2>
                                <p style={{ color: '#555', fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>PROJECTS DONE</p>
                            </div>
                            <div>
                                <h2 style={{ fontSize: '4rem', margin: 0, fontWeight: 900 }}>{dbStats.achivements}+</h2>
                                <p style={{ color: '#555', fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>AWARDS WON</p>
                            </div>
                        </div>
                    </div>
                ) : <p style={{color: '#444'}}>No stats. Click "Add Stats" to begin.</p>}
            </div>
        </section>
    );
};

export default Stats;