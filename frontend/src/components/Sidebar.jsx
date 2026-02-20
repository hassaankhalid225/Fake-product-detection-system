import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiBox, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div
            className="glass-panel"
            style={{
                width: '280px',
                height: 'calc(100vh - 40px)',
                margin: '20px',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h2 className="heading" style={{ fontSize: '1.8rem', marginBottom: '0' }}>VeriChain</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Admin Portal</p>
            </div>

            <nav style={{ flex: 1 }}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '16px' }}>
                        <NavLink
                            to="/admin/dashboard"
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(168, 85, 247, 0.4) 100%)' : 'transparent',
                                border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
                                transition: 'all 0.3s ease'
                            })}
                        >
                            <FiHome style={{ marginRight: '12px', fontSize: '1.2rem' }} />
                            Dashboard
                        </NavLink>
                    </li>
                    <li style={{ marginBottom: '16px' }}>
                        <NavLink
                            to="/admin/products"
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(168, 85, 247, 0.4) 100%)' : 'transparent',
                                border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
                                transition: 'all 0.3s ease'
                            })}
                        >
                            <FiBox style={{ marginRight: '12px', fontSize: '1.2rem' }} />
                            Product Management
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <FiLogOut style={{ marginRight: '8px' }} />
                Logout
            </button>
        </div>
    );
};

export default Sidebar;
