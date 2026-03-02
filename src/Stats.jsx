import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Stats = () => {
    const [dbStats, setDbStats] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

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
        const exp = prompt("Experience?", dbStats?.experience || "0");
        const clie = prompt("Clients?", dbStats?.clients || "0");
        const proj = prompt("Projects?", dbStats?.projects || "0");
        const achi = prompt("Achievements?", dbStats?.achivements || "0");

        const payload = { 
            experience: Number(exp), 
            clients: Number(clie), 
            projects: Number(proj), 
            achivements: Number(achi),
            icon: "star"
        };

        try {
            if (dbStats?._id) {
                await axios.put(`${API_URL}/admin/stats/${dbStats._id}`, payload, { withCredentials: true });
            } else {
                await axios.post(`${API_URL}/admin/stats`, payload, { withCredentials: true });
            }
            alert("Success!");
            fetchData();
        } catch (err) {
            alert("Failed! Login again.");
        }
    };

    if (loading) return <div style={{color:'#fff', textAlign:'center'}}>Loading...</div>;

    return (
        <section style={{ background: '#000', color: '#fff', padding: '50px 10%' }}>
            {isAdmin && <button onClick={handleSave} style={{background:'#ff0000', color:'#fff', padding:'10px', cursor:'pointer', marginBottom:'20px'}}>EDIT STATS</button>}
            
            {dbStats ? (
                <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
                    <div><h1 style={{fontSize:'5rem'}}>{dbStats.experience}</h1><p>YEARS EXP</p></div>
                    <div><h1>{dbStats.clients}+</h1><p>CLIENTS</p></div>
                    <div><h1>{dbStats.projects}+</h1><p>PROJECTS</p></div>
                    <div><h1>{dbStats.achivements}+</h1><p>AWARDS</p></div>
                </div>
            ) : <p>No Stats Found. Click Edit to add.</p>}
        </section>
    );
};

export default Stats;