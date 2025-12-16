import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import Input from '../components/Input';
import { ArrowLeft, Lock } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const res = await client.post('/forgot-password', { email });
            if (res.data.success) {
                setMessage(res.data.message);
                // pass email to next page state
                setTimeout(() => {
                    navigate('/reset-password', { state: { email } });
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '1rem', color: '#111827', textDecoration: 'none' }}>
                <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} />
            </Link>

            <div className="auth-header">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Lock size={40} />
                </div>
                <h2 className="auth-title">Reset your password</h2>
                <p className="auth-subtitle">Enter your registered email address</p>
            </div>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <form onSubmit={handleSubmit}>
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="johndoe@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={true}
                />

                <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1.5rem' }}>
                    {loading ? 'Sending...' : 'Send Code'}
                </button>
            </form>
        </div>
    );
}
