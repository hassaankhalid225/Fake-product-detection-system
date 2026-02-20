import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        productName: '',
        serialNumber: '',
        batchNumber: '',
        manufacturingDate: '',
        quantity: '',
        description: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await axios.post('http://localhost:5000/api/products', formData);
            setMessage({ type: 'success', text: `Product registered securely on Blockchain! Tx: ${res.data.blockchainTxId}` });
            setFormData({ productName: '', serialNumber: '', batchNumber: '', manufacturingDate: '', quantity: '', description: '' });
            fetchProducts();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.msg || 'Error adding product' });
        } finally {
            setSubmitting(false);
        }
    };

    const getVerificationUrl = (serialNumber) => `http://localhost:5173/verify/${serialNumber}`;

    return (
        <div className="animate-fade-in" style={{ width: '100%' }}>
            <h1 className="heading">Product Management</h1>
            <p className="subheading">Register products and generate smart seals</p>

            <div className="grid-cols-2">
                {/* Form Column */}
                <div className="glass-panel" style={{ padding: '30px' }}>
                    <h2 style={{ marginBottom: '24px', fontSize: '1.2rem', fontWeight: 600 }}>Register New Product</h2>

                    {message.text && (
                        <div style={{
                            backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--error)'}`,
                            color: message.type === 'success' ? 'var(--success)' : 'var(--error)',
                            padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem'
                        }}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="grid-cols-2" style={{ gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label>Product Name</label>
                                <input type="text" name="productName" value={formData.productName} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Serial Number (Unique)</label>
                                <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="grid-cols-2" style={{ gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label>Batch Number</label>
                                <input type="text" name="batchNumber" value={formData.batchNumber} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Manufacturing Date</label>
                                <input type="date" name="manufacturingDate" value={formData.manufacturingDate} onChange={handleChange} required />
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label>Quantity</label>
                            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required></textarea>
                        </div>

                        <button type="submit" className="btn" style={{ width: '100%' }} disabled={submitting}>
                            {submitting ? 'Registering to Blockchain...' : 'Register Product'}
                        </button>
                    </form>
                </div>

                {/* List Column */}
                <div className="glass-panel" style={{ padding: '30px', overflowY: 'auto', maxHeight: '700px' }}>
                    <h2 style={{ marginBottom: '24px', fontSize: '1.2rem', fontWeight: 600 }}>Registered Products & QR Codes</h2>

                    {loading ? <div className="loader"></div> : products.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No products found locally.</p>
                    ) : (
                        products.map((product) => (
                            <div
                                key={product._id}
                                style={{
                                    padding: '20px',
                                    border: '1px solid var(--surface-border)',
                                    borderRadius: '12px',
                                    marginBottom: '20px',
                                    display: 'flex',
                                    gap: '20px',
                                    alignItems: 'center',
                                    background: 'rgba(255, 255, 255, 0.02)'
                                }}
                            >
                                <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px' }}>
                                    <QRCodeSVG value={getVerificationUrl(product.serialNumber)} size={100} />
                                </div>

                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>
                                        {product.productName}
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        <span><strong>Serial:</strong> {product.serialNumber}</span>
                                        <span><strong>Batch:</strong> {product.batchNumber}</span>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            background: 'rgba(168, 85, 247, 0.2)',
                                            color: 'var(--secondary)',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            display: 'inline-block',
                                            marginTop: '8px',
                                            wordBreak: 'break-all'
                                        }}>
                                            Hash: {product.hash.substring(0, 20)}...
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;
