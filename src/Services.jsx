import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:3000/getservices');
      setServices(res.data);
      await axios.get('http://localhost:3000/admin/status', { withCredentials: true });
      setIsAdmin(true);
    } catch (err) { setIsAdmin(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    const title = prompt("Service Title?");
    const icon = prompt("Icon (e.g. 💻)?");
    const discription = prompt("Description?");
    if (title && icon && discription) {
      try {
        await axios.post('http://localhost:3000/admin/services', { title, icon, discription }, { withCredentials: true });
        fetchData();
      } catch (err) { alert("Failed! Check if you are logged in."); }
    }
  };

  const handleEdit = async (id, oldTitle, oldIcon, oldDesc) => {
    const title = prompt("Update Title?", oldTitle);
    const icon = prompt("Update Icon?", oldIcon);
    const discription = prompt("Update Description?", oldDesc);
    if (title && discription) {
      try {
        await axios.put(`http://localhost:3000/admin/services/${id}`, { title, icon, discription }, { withCredentials: true });
        fetchData();
      } catch (err) { alert("Update failed!"); }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("confirm delete ?")) {
      try {
        await axios.delete(`http://localhost:3000/admin/services/${id}`, { withCredentials: true });
        fetchData();
      } catch (err) { alert("Delete failed!"); }
    }
  };

  return (
    <section className="serv-section">
      <div className="serv-head">
        <h2>MY SERVICES</h2>
        {/* ALERT HATA KAR handleAdd LAGA DIYA */}
        {isAdmin && <button onClick={handleAdd} className="mini-add">+ ADD</button>}
      </div>

      <div className="serv-grid">
        {services.map((s) => (
          <div key={s._id} className="serv-card">
            <div className="serv-icon">{s.icon}</div>
            <h4 className="serv-title">{s.title}</h4>
            <p className="serv-text">{s.discription}</p>

            {isAdmin && (
              <div className="mini-admin-panel">
                <button onClick={() => handleEdit(s._id, s.title, s.icon, s.discription)}>✎</button>
                <button onClick={() => handleDelete(s._id)} className="mini-del">🗑</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;