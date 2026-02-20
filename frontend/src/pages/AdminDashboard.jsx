import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalProducts: 0, totalVerifications: 0, fakeAttempts: 0, recentLogs: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // In a real app we'd pass headers: Authorization: Bearer token
            const res = await axios.get('http://localhost:5000/api/analytics/stats');
            setStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loader"></div>;

    const doughnutData = {
        labels: ['Verified Originals', 'Fake Attempts'],
        datasets: [
            {
                data: [stats.totalVerifications - stats.fakeAttempts, stats.fakeAttempts],
                backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
                borderColor: ['#10b981', '#ef4444'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="animate-fade-in" style={{ width: '100%' }}>
            <h1 className="heading">Admin Dashboard</h1>
            <p className="subheading">Overview of your verification system activity</p>

            <div className="grid-cols-4" style={{ marginBottom: '40px' }}>
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Registered Products</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.totalProducts}</p>
                </div>

                <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Blockchain Verifications</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{stats.totalVerifications}</p>
                </div>

                <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Counterfeit Attempts</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--error)' }}>{stats.fakeAttempts}</p>
                </div>
            </div>

            <div className="grid-cols-2">
                <div className="glass-panel" style={{ padding: '30px' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 600 }}>Verification Health</h2>
                    <div style={{ maxWidth: '300px', margin: '0 auto' }}>
                        <Doughnut
                            data={doughnutData}
                            options={{ maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { color: '#f8fafc' } } } }}
                        />
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '30px', overflowY: 'auto', maxHeight: '420px' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 600 }}>Recent Activity Logs</h2>
                    {stats.recentLogs.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No verifications recorded yet.</p>
                    ) : (
                        stats.recentLogs.map((log, index) => (
                            <div
                                key={log._id || index}
                                style={{
                                    padding: '12px',
                                    borderBottom: '1px solid var(--surface-border)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <p style={{ fontWeight: 600 }}>Serial: {log.serialNumber}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {new Date(log.createdAt).toLocaleString()} | IP: {log.ipAddress}
                                    </p>
                                </div>
                                <span style={{
                                    padding: '6px 12px',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    backgroundColor: log.status === 'Verified Original Product' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                    color: log.status === 'Verified Original Product' ? 'var(--success)' : 'var(--error)'
                                }}>
                                    {log.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
