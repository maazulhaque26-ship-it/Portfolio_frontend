return (
    <section className="stats-section" style={{ background: '#000', color: '#fff', padding: '80px 10%', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* Admin Controls - Only for Maazul */}
            {isAdmin && (
                <div style={{ marginBottom: '40px', display: 'flex', gap: '15px' }}>
                    <button onClick={handleSave} className="edit-btn">
                        {dbStats ? "✎ EDIT STATS" : "+ ADD STATS"}
                    </button>
                </div>
            )}

            {/* Display Stats - Premium Look */}
            {dbStats ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '80px', flexWrap: 'wrap' }}>
                    
                    {/* Big Experience Number */}
                    <div style={{ textAlign: 'left' }}>
                        <h1 className="huge-num" style={{ margin: 0, color: '#fff' }}>
                            {dbStats.experience}
                        </h1>
                        <p style={{ color: '#ff4d4d', fontSize: '14px', fontWeight: 800, letterSpacing: '2px', marginTop: '10px', lineHeight: '1.2' }}>
                            YEARS OF<br />EXPERIENCE
                        </p>
                    </div>

                    {/* Other Stats Grid */}
                    <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap', flex: 1, justifyContent: 'space-around' }}>
                        <div style={{ textAlign: 'left' }}>
                            <h2 style={{ fontSize: '3.5rem', margin: 0, fontWeight: 900 }}>{dbStats.clients}+</h2>
                            <p style={{ color: '#555', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Global Clients</p>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <h2 style={{ fontSize: '3.5rem', margin: 0, fontWeight: 900 }}>{dbStats.projects}+</h2>
                            <p style={{ color: '#555', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Projects Done</p>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <h2 style={{ fontSize: '3.5rem', margin: 0, fontWeight: 900 }}>{dbStats.achivements}+</h2>
                            <p style={{ color: '#555', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Awards Won</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ border: '1px dashed #222', padding: '40px', textAlign: 'center' }}>
                    <p style={{ color: '#444' }}>No statistics found. Click edit to initialize.</p>
                </div>
            )}
        </div>
    </section>
);