import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        await axios.get('http://localhost:3000/admin/status', { withCredentials: true });
        setIsAdmin(true);
      } catch (err) {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/admin/logout', {}, { withCredentials: true });
      alert("Logout Success!");
      window.location.reload(); 
    } catch (err) {
      alert("Logout Failed!");
    }
  };

  return (
    <nav className="nav-container">
      {/* 1. Logo */}
      <div className="nav-logo">
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
          <path d="M50 85L20 40L30 15H70L80 40L50 85Z" stroke="#E53E3E" strokeWidth="4" fill="transparent"/>
          <path d="M40 15L50 40M60 15L50 40M50 40V65" stroke="#E53E3E" strokeWidth="3"/>
        </svg>
      </div>

      {/* 2. Dynamic Greeting (Center) */}
      <div className="nav-greeting">
        {isAdmin ? "HELLO ADMIN" : "WELCOME VIEWERS"}
      </div>

      {/* 3. Logout (Right) */}
      <div className="nav-actions">
        {isAdmin && (
          <button onClick={handleLogout} className="nav-logout-btn">
            LOGOUT
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;