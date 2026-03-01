import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Hero = () => {
    const [heroData, setHeroData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    
    const [formData, setFormData] = useState({ greeting: '', title: '', description: '', imageUrl: '' });

    const fetchData = async () => {
        try {
            const res = await axios.get('/gethero'); 
            if (res.data) {
                setHeroData(res.data);
                setFormData(res.data);
            }
            const adminRes = await axios.get('/admin/status');
            if (adminRes.status === 200) setIsAdmin(true);
        } catch (err) {
            console.log("Not logged in or no data yet");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (heroData && heroData._id) {
                await axios.put(`/admin/hero/${heroData._id}`, formData);
            } else {
                await axios.post('/admin/hero', formData);
            }
            alert("Hero Saved Successfully!");
            setIsEditing(false);
            fetchData();
        } catch (err) { 
            console.error(err);
            alert("Failed! Check console for errors."); 
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Delete Hero Section?")) {
            try {
                await axios.delete(`/admin/hero/${heroData._id}`);
                setHeroData(null);
                setFormData({ greeting: '', title: '', description: '', imageUrl: '' });
                fetchData();
            } catch (err) { alert("Delete failed!"); }
        }
    };

    if (loading) return <div style={{color: 'white', textAlign: 'center', padding: '50px'}}>Loading...</div>;

    return (
        <section className="hero-section" style={{ background: '#000', color: '#fff', padding: '100px 10%' }}>
            <div className="hero-container">
                {isAdmin && (isEditing || !heroData) ? (
                    <div className="admin-form-card" style={{ background: '#0a0a0a', padding: '40px', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
                        <h2 style={{ marginBottom: '20px' }}>{heroData ? "Edit Hero Section" : "Initialize Hero Section"}</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input type="text" placeholder="Greeting (e.g. Hello, I'm)" value={formData.greeting} onChange={(e)=>setFormData({...formData, greeting: e.target.value})} style={{ padding: '12px', background: '#111', border: '1px solid #333', color: '#fff' }} required />
                            <input type="text" placeholder="Your Name/Title" value={formData.title} onChange={(e)=>setFormData({...formData, title: e.target.value})} style={{ padding: '12px', background: '#111', border: '1px solid #333', color: '#fff' }} required />
                            <textarea placeholder="Tell something about yourself" value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} style={{ padding: '12px', background: '#111', border: '1px solid #333', color: '#fff', height: '100px' }} required />
                            <input type="text" placeholder="Image URL (Direct link)" value={formData.imageUrl} onChange={(e)=>setFormData({...formData, imageUrl: e.target.value})} style={{ padding: '12px', background: '#111', border: '1px solid #333', color: '#fff' }} required />
                            
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{ background: '#ff4d4d', color: '#fff', border: 'none', padding: '12px 30px', cursor: 'pointer', fontWeight: 'bold' }}>SAVE HERO</button>
                                {heroData && <button type="button" onClick={()=>setIsEditing(false)} style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '12px 30px', cursor: 'pointer' }}>CANCEL</button>}
                            </div>
                        </form>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '50px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <img src={heroData?.imageUrl || "https://via.placeholder.com/400"} alt="Hero" style={{ width: '100%', borderRadius: '15px', border: '2px solid #1a1a1a' }} />
                        </div>
                        <div style={{ flex: 2, minWidth: '300px' }}>
                            <h4 style={{ color: '#ff4d4d', letterSpacing: '2px', marginBottom: '10px' }}>{heroData?.greeting}</h4>
                            <h1 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '20px' }}>{heroData?.title}</h1>
                            <p style={{ color: '#888', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '30px' }}>{heroData?.description}</p>
                            
                            {isAdmin && (
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <button onClick={()=>setIsEditing(true)} style={{ background: '#3498db', color: '#fff', border: 'none', padding: '10px 25px', cursor: 'pointer', fontWeight: 'bold' }}>EDIT HERO</button>
                                    <button onClick={handleDelete} style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '10px 25px', cursor: 'pointer', fontWeight: 'bold' }}>DELETE</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Hero;