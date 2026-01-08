import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import Input from '../components/Input';
import { Key } from 'lucide-react';

export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';

    const [step, setStep] = useState(1); // 1: OTP, 2: Password
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerifyCode = (e) => {
        e.preventDefault();
        // Since backend doesn't have a standalone verify endpoint, 
        // we just move to the next step.
        // In a real app, you'd ideally verify the code here first.
        if (code.length < 6) {
            setError('Please enter a valid 6-digit code');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setLoading(true);

        try {
            const res = await client.post('/auth/reset-password', {
                email,
                code,
                newPassword
            });
            if (res.data.success) {

                setSuccess('Password reset successfully!');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return <div className="auth-container"><p>Error: No email flow detected. <Link to="/forgot-password">Go back</Link></p></div>;
    }

    return (
        <div className="auth-container">
            {step === 1 ? (
                <>
                    <div className="auth-header">
                        <h2 className="auth-title">Check your email</h2>
                        <p className="auth-subtitle">Please enter the 6-digit code sent to<br />{email}</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleVerifyCode}>
                        <Input
                            label="6-digit code"
                            name="code"
                            placeholder="1 2 3 4 5 6"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required={true}
                            style={{ letterSpacing: '0.2rem', textAlign: 'center' }}
                        />
                        <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }}>
                            Verify Code
                        </button>
                        <div className="link-center">
                            <span style={{ color: '#6b7280' }}>Didn't receive code? </span> <button type="button" onClick={() => alert('Resend functionality to be implemented')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontWeight: 500 }}>Resend</button>
                        </div>
                        <div className="link-center" style={{ marginTop: '1.5rem' }}>
                            Go back to the <Link to="/login" style={{ color: '#4b5563' }}>Login page</Link>
                        </div>
                    </form>
                </>
            ) : (
                <>
                    <div className="auth-header">
                        <h2 className="auth-title">Set new password</h2>
                        <p className="auth-subtitle">Create and confirm your new password.</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <Input
                                label="New Password"
                                type="password"
                                name="newPassword"
                                placeholder="........"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required={true}
                                icon={Key}
                            />
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '-0.5rem' }}>
                                Must be at least 8 characters
                            </p>
                        </div>

                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            placeholder="........"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required={true}
                            icon={Key}
                        />

                        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1.5rem' }}>
                            {loading ? 'Resetting...' : 'Reset password'}
                        </button>

                        <div className="link-center">
                            Go back to the <Link to="/login" style={{ color: '#4b5563' }}>Login page</Link>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}
