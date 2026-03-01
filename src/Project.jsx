import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:3000/getprojects');
      setProjects(res.data);
      await axios.get('http://localhost:3000/admin/status', { withCredentials: true });
      setIsAdmin(true);
    } catch (err) {
      setIsAdmin(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddProject = async () => {
    const title = prompt("Project Name?");
    const url = prompt("Image URL?");
    const vercelUrl = prompt("Vercel Link?", "https://portfolio-maazulhaque.vercel.app/");
    if (title && url) {
      try {
        await axios.post('http://localhost:3000/admin/product', { title, url, vercelUrl }, { withCredentials: true });
        fetchData();
      } catch (err) { alert("Add failed!"); }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Pakka uda du lala?")) {
      try {
        await axios.delete(`http://localhost:3000/admin/product/${id}`, { withCredentials: true });
        setProjects(projects.filter(p => p._id !== id));
      } catch (err) { alert("Delete failed!"); }
    }
  };

  const handleUpdate = async (project) => {
    const newTitle = prompt("New Title:", project.title);
    const newUrl = prompt("New Image URL:", project.url);
    const newVercel = prompt("New Vercel Link:", project.vercelUrl || "");
    if (newTitle && newUrl) {
      try {
        await axios.put(`http://localhost:3000/admin/product/${project._id}`, 
          { title: newTitle, url: newUrl, vercelUrl: newVercel }, 
          { withCredentials: true }
        );
        fetchData();
      } catch (err) { alert("Update failed!"); }
    }
  };

  const handleLinkEdit = async (project) => {
    const newLink = prompt("Update Project Link:", project.vercelUrl);
    if (newLink !== null) {
      try {
        await axios.put(`http://localhost:3000/admin/product/${project._id}`, 
          { ...project, vercelUrl: newLink }, 
          { withCredentials: true }
        );
        fetchData();
      } catch (err) { alert("Link update failed!"); }
    }
  };

  return (
    <section className="projects-section" style={{ background: '#000', color: '#fff', padding: '80px 10%' }}>
      <div className="projects-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '900' }}>FEATURED PROJECTS</h1>
        {isAdmin && (
          <button onClick={handleAddProject} style={{ background: '#ff4d4d', color: '#fff', border: 'none', padding: '12px 25px', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px' }}>
            + ADD NEW PROJECT
          </button>
        )}
      </div>

      <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '50px' }}>
        {projects.map((project) => (
          <div className="project-card" key={project._id} style={{ background: '#0a0a0a', padding: '30px', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
            <div style={{ background: '#111', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
              <img src={project.url} alt={project.title} style={{ width: '100%', borderRadius: '4px' }} />
            </div>

            <h3 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>{project.title}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* "KNOW MORE" Styled as a Button */}
              <a 
                href={project.vercelUrl || "https://portfolio-maazulhaque.vercel.app/"} 
                target="_blank" 
                rel="noreferrer" 
                onClick={(e) => {
                  if (isAdmin) {
                    e.preventDefault();
                    handleLinkEdit(project);
                  }
                }}
                style={{ 
                  display: 'inline-block',
                  textAlign: 'center',
                  background: '#ff4d4d', 
                  color: '#fff', 
                  textDecoration: 'none', 
                  fontWeight: 'bold', 
                  padding: '12px 20px', 
                  borderRadius: '4px',
                  fontSize: '14px',
                  letterSpacing: '1px',
                  transition: '0.3s'
                }}
                onMouseOver={(e) => e.target.style.background = '#b31b1b'}
                onMouseOut={(e) => e.target.style.background = '#ff4d4d'}
              >
                {isAdmin ? "EDIT PROJECT LINK" : "KNOW MORE"}
              </a>

              {/* Action Buttons for Admin */}
              {isAdmin && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={() => handleUpdate(project)} style={{ flex: 1, background: 'transparent', color: '#3498db', border: '1px solid #3498db', padding: '10px', cursor: 'pointer', fontSize: '12px' }}>
                    EDIT INFO
                  </button>
                  <button onClick={() => handleDelete(project._id)} style={{ flex: 1, background: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', padding: '10px', cursor: 'pointer', fontSize: '12px' }}>
                    DELETE
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;