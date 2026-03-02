import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Contact = () => {
  const [contactData, setContactData] = useState({ linkTitle: 'CONNECT WITH ME', linkUrl: '#' });
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchContact = async () => {
    try {
      const res = await axios.get('https://portfolio-backend-vnu1.onrender.com/getcontact');
      if (res.data) setContactData(res.data);
      
      await axios.get('https://portfolio-backend-vnu1.onrender.com/admin/status', { withCredentials: true });
      setIsAdmin(true);
    } catch (err) {
      setIsAdmin(false);
    }
  };

  useEffect(() => { fetchContact(); }, []);

  const handleEditContact = async (e) => {
    if (isAdmin) {
      e.preventDefault(); 
      const newTitle = prompt("Enter Link Text (e.g. LINKEDIN):", contactData.linkTitle);
      const newUrl = prompt("Enter Full URL:", contactData.linkUrl);
      
      if (newTitle && newUrl) {
        try {
          await axios.put('https://portfolio-backend-vnu1.onrender.com/admin/contact', 
            { linkTitle: newTitle, linkUrl: newUrl }, 
            { withCredentials: true }
          );
          fetchContact();
          alert("Contact Link Updated!");
        } catch (err) {
          alert("Update failed!");
        }
      }
    }
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p className="footer-label">
            {isAdmin ? "ADMIN: CLICK TO EDIT LINK" : "GET IN TOUCH"}
        </p>

        <a 
          href={contactData.linkUrl} 
          target="_blank" 
          rel="noreferrer" 
          onClick={handleEditContact}
          className="footer-main-link"
        >
          {contactData.linkTitle} <span className="arrow">→</span>
        </a>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MAAZUL HAQUE. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
};

export default Contact;