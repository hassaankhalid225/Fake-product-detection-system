import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiLock, FiMail } from 'react-icons/fi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', width: '100%' }}>
            <div className="glass-panel animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '420px', textAlign: 'center' }}>
                <h1 className="heading" style={{ fontSize: '2rem', marginBottom: '8px' }}>VeriChain</h1>
                <p className="subheading" style={{ marginBottom: '30px' }}>Admin login for Product Verification System</p>

                {error && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', color: 'var(--error)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '16px', position: 'relative' }}>
                        <FiMail style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--text-secondary)' }} />
                        <input
                            type="email"
                            placeholder="Email address"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ paddingLeft: '44px', margin: 0 }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px', position: 'relative' }}>
                        <FiLock style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--text-secondary)' }} />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ paddingLeft: '44px', margin: 0 }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Sign In To Dashboard'}
                    </button>
                </form>

                <p style={{ marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Secured by Blockchain Technology
                </p>
            </div>
        </div>
    );
};

export default Login;
