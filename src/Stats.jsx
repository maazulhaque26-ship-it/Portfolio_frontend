return (
    <section style={{ background: '#000', color: '#fff', padding: '100px 8%', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
            
            {isAdmin && (
                <button onClick={handleSave} className="edit-btn" style={{ marginBottom: '50px' }}>
                    ✎ EDIT STATS
                </button>
            )}

            {dbStats ? (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    flexWrap: 'wrap',
                    gap: '40px' 
                }}>
                    {/* Experience */}
                    <div style={{ textAlign: 'left', minWidth: '200px' }}>
                        <h1 className="stat-number">{dbStats.experience}</h1>
                        <p className="stat-label">YEARS OF<br/>EXPERIENCE</p>
                    </div>

                    {/* Clients */}
                    <div style={{ textAlign: 'left', minWidth: '200px' }}>
                        <h1 className="stat-number">{dbStats.clients}+</h1>
                        <p className="stat-label">GLOBAL<br/>CLIENTS</p>
                    </div>

                    {/* Projects */}
                    <div style={{ textAlign: 'left', minWidth: '200px' }}>
                        <h1 className="stat-number">{dbStats.projects}+</h1>
                        <p className="stat-label">PROJECTS<br/>COMPLETED</p>
                    </div>

                    {/* Awards */}
                    <div style={{ textAlign: 'left', minWidth: '200px' }}>
                        <h1 className="stat-number">{dbStats.achivements}+</h1>
                        <p className="stat-label">AWARDS<br/>ACHIEVED</p>
                    </div>
                </div>
            ) : (
                <p style={{ color: '#444', textAlign: 'center' }}>No stats available.</p>
            )}
        </div>
    </section>
);