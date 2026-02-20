import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiSearch, FiCamera } from 'react-icons/fi';
import { Html5QrcodeScanner } from 'html5-qrcode';

const VerificationPage = () => {
    const { serialNumber: urlSerial } = useParams();
    const navigate = useNavigate();
    const [serialInput, setSerialInput] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    useEffect(() => {
        if (urlSerial) {
            setSerialInput(urlSerial);
            handleVerify(urlSerial);
        }
    }, [urlSerial]);

    useEffect(() => {
        if (showScanner) {
            const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
            scanner.render(
                (decodedText) => {
                    scanner.clear();
                    setShowScanner(false);
                    // Assuming QR code contains the full URL, parsing it via simple match or string manipulation
                    let extractedSerial = decodedText;
                    if (decodedText.includes('/verify/')) {
                        extractedSerial = decodedText.split('/verify/')[1];
                    }
                    setSerialInput(extractedSerial);
                    navigate(`/verify/${extractedSerial}`);
                },
                (error) => {
                    // ignore scan errors until success
                }
            );

            return () => {
                scanner.clear().catch(e => console.error(e));
            };
        }
    }, [showScanner, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (serialInput.trim()) {
            navigate(`/verify/${serialInput.trim()}`);
        }
    };

    const handleVerify = async (serial) => {
        setLoading(true);
        setResult(null);

        try {
            const res = await axios.post(`http://localhost:5000/api/verify/${serial}`);
            setResult({ status: 'success', data: res.data });
        } catch (err) {
            setResult({
                status: 'error',
                data: err.response?.data || { msg: 'Server error. Could not verify product.' }
            });
        } finally {
            setLoading(false);
        }
    };

    const renderResult = () => {
        if (!result) return null;

        const { status, data } = result;
        const isSuccess = data.status === 'Verified Original Product';
        const isDuplicate = data.status === 'Duplicate Serial Detected';

        let icon, color, bgColor;

        if (isSuccess) {
            icon = <FiCheckCircle size={64} color="var(--success)" />;
            color = 'var(--success)';
            bgColor = 'rgba(16, 185, 129, 0.1)';
        } else if (isDuplicate) {
            icon = <FiAlertTriangle size={64} color="var(--warning)" />;
            color = 'var(--warning)';
            bgColor = 'rgba(245, 158, 11, 0.1)';
        } else {
            icon = <FiXCircle size={64} color="var(--error)" />;
            color = 'var(--error)';
            bgColor = 'rgba(239, 68, 68, 0.1)';
        }

        return (
            <div
                className="glass-panel animate-fade-in"
                style={{
                    marginTop: '30px',
                    padding: '40px',
                    textAlign: 'center',
                    backgroundColor: bgColor,
                    border: `1px solid ${color}`
                }}
            >
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
                <h2 style={{ fontSize: '1.8rem', color: color, marginBottom: '16px' }}>{data.status || data.msg}</h2>

                {isSuccess && data.product && (
                    <div style={{ textAlign: 'left', marginTop: '30px', padding: '20px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px' }}>
                        <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Blockchain Authenticated Meta</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.95rem' }}>
                            <p><span style={{ color: 'var(--text-secondary)' }}>Product:</span> {data.product.productName}</p>
                            <p><span style={{ color: 'var(--text-secondary)' }}>Serial:</span> {data.product.serialNumber}</p>
                            <p><span style={{ color: 'var(--text-secondary)' }}>Batch:</span> {data.product.batchNumber}</p>
                            <p><span style={{ color: 'var(--text-secondary)' }}>Mfg Date:</span> {new Date(data.product.manufacturingDate).toLocaleDateString()}</p>
                        </div>
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--surface-border)' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px' }}>Blockchain Immutability Lock:</p>
                            <p style={{ wordBreak: 'break-all', fontSize: '0.85rem', color: 'var(--primary)', fontFamily: 'monospace' }}>
                                {data.product.hash}
                            </p>
                        </div>
                    </div>
                )}

                {isDuplicate && (
                    <p style={{ color: 'var(--text-primary)', marginTop: '16px' }}>
                        Warning: This serial number has been scanned {data.count} times across suspicious zones. It may be compromised.
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', width: '100%', flexDirection: 'column' }}>

            <div className="glass-panel animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '600px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 className="heading" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>VeriChain Scanner</h1>
                    <p className="subheading" style={{ marginBottom: '0' }}>Verify your product's authenticity via Blockchain</p>
                </div>

                {showScanner ? (
                    <div style={{ marginBottom: '24px' }}>
                        <div id="reader" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden' }}></div>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setShowScanner(false)}
                            style={{ width: '100%', marginTop: '16px' }}
                        >
                            Cancel Scan
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <FiSearch style={{ position: 'absolute', top: '18px', left: '16px', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                placeholder="Enter Serial Number..."
                                value={serialInput}
                                onChange={(e) => setSerialInput(e.target.value)}
                                style={{ margin: 0, paddingLeft: '44px' }}
                            />
                        </div>
                        <button type="submit" className="btn" disabled={loading || !serialInput.trim()}>
                            {loading ? 'Verifying...' : 'Verify'}
                        </button>
                    </form>
                )}

                {!showScanner && (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: '16px 0', color: 'var(--text-secondary)' }}>OR</p>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setShowScanner(true)}
                            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                        >
                            <FiCamera /> Scan QR Code
                        </button>
                    </div>
                )}
            </div>

            <div style={{ width: '100%', maxWidth: '600px' }}>
                {renderResult()}
            </div>

        </div>
    );
};

export default VerificationPage;
