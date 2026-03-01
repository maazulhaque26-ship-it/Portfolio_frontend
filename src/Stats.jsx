import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Stats = () => {
    const [dbStats, setDbStats] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:3000/getstats');
            setDbStats(res.data);
            
            const adminRes = await axios.get('http://localhost:3000/admin/status', { withCredentials: true });
            if (adminRes.status === 200) setIsAdmin(true);
        } catch (err) {
            setIsAdmin(false); 
            console.log("Not logged in or no stats found");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async () => {
        const icon = prompt("Icon Name (required)?", dbStats?.icon || "star");
        const exp = prompt("Years of Experience (Number)?", dbStats?.experience || "0");
        const clie = prompt("Total Clients (Number)?", dbStats?.clients || "0");
        const proj = prompt("Projects Done (Number)?", dbStats?.projects || "0");
        const achi = prompt("Achievements (Number)?", dbStats?.achivements || "0");

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
                    await axios.put(`http://localhost:3000/admin/stats/${dbStats._id}`, payload, { withCredentials: true });
                } else {
                    await axios.post('http://localhost:3000/admin/stats', payload, { withCredentials: true });
                }
                alert("Stats Updated Successfully!");
                fetchData();
            } catch (err) {
                alert("Action Failed! Check if you are logged in.");
            }
        } else {
            alert("All fields are required lala!");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete these stats?")) {
            try {
                await axios.delete(`http://localhost:3000/admin/stats/${dbStats._id}`, { withCredentials: true });
                alert("Stats Deleted!");
                setDbStats(null); 
                fetchData();
            } catch (err) {
                alert("Delete failed! Check permissions.");
            }
        }
    };

    if (loading) return <div style={{color:'#fff', textAlign:'center', padding:'20px'}}>Loading Stats...</div>;

    return (
        <section style={{ background: '#000', color: '#fff', padding: '80px 10%', borderTop: '1px solid #111' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                
                {/* Admin Controls */}
                {isAdmin && (
                    <div style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
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

                {/* Display Stats */}
                {dbStats ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '100px', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'left' }}>
                            <h1 style={{ fontSize: '8rem', margin: 0, fontWeight: 900, lineHeight: 1, letterSpacing: '-5px' }}>
                                {dbStats.experience}
                            </h1>
                            <p style={{ color: '#ff4d4d', fontSize: '14px', fontWeight: 800, letterSpacing: '2px', marginTop: '10px' }}>
                                YEARS OF<br />EXPERIENCE
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
                            <div style={{ textAlign: 'left' }}>
                                <h2 style={{ fontSize: '3rem', margin: 0, fontWeight: 900 }}>{dbStats.clients}+</h2>
                                <p style={{ color: '#555', fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>GLOBAL CLIENTS</p>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <h2 style={{ fontSize: '3rem', margin: 0, fontWeight: 900 }}>{dbStats.projects}+</h2>
                                <p style={{ color: '#555', fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>PROJECTS DONE</p>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <h2 style={{ fontSize: '3rem', margin: 0, fontWeight: 900 }}>{dbStats.achivements}+</h2>
                                <p style={{ color: '#555', fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>AWARDS WON</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ border: '1px dashed #333', padding: '60px', textAlign: 'center', borderRadius: '10px' }}>
                        <p style={{ color: '#555' }}>No statistics available. Click the button above to add some.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Stats;