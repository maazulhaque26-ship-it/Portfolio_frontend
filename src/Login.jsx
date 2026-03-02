import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Purana error clear karne ke liye
        
        try {
            // Backend URL ekdum sahi hai
            const res = await axios.post('https://portfolio-backend-vnu1.onrender.com/admin/login', 
                { email, password }, 
                { withCredentials: true } // Cookies ke liye zaroori hai
            );

            if (res.status === 200) {
                alert("Login Successful!");
                // YAHAN BADLAV KIYA HAI: Ab ye viewers page par nahi, Admin Dashboard par bhejega
                navigate('/admin'); 
            }
        } catch (err) {
            // Error handling ko thoda behtar kiya hai
            setError(err.response?.data?.msg || "Email ya Password galat hai!");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2 className="login-title">ADMIN <span className="red-text">LOGIN</span></h2>
                
                {error && <div className="error-box" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-field">
                        <label>EMAIL ADDRESS</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            required
                        />
                    </div>

                    <div className="input-field">
                        <label>PASSWORD</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">LOGIN NOW</button>
                </form>
            </div>
        </div>
    );
};

export default Login;