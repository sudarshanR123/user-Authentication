import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import client from '../api/client';
import Input from '../components/Input';
import { Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';

export default function Login() {
    const [formData, setFormData] = useState({
        emailOrUsername: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const roleParam = searchParams.get('role') || 'none';

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await client.post('/auth/login', formData);
            localStorage.setItem('token', response.data.token); // Keep token storage

            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('userRole', response.data.role);
            localStorage.setItem('userName', response.data.username);

            // Redirect based on role
            if (response.data.role === 'seeker') {
                navigate('/dashboard/seeker');
            } else if (response.data.role === 'employer') {
                navigate('/dashboard/employer');
            } else {
                navigate('/profile/select');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                const response = await client.post('/auth/google', {
                    token: tokenResponse.access_token,
                    role: roleParam
                });

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('userRole', response.data.role);
                localStorage.setItem('userName', response.data.username);

                if (response.data.role === 'seeker') {
                    navigate('/dashboard/seeker');
                } else if (response.data.role === 'employer') {
                    navigate('/dashboard/employer');
                } else {
                    navigate('/profile/select');
                }
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || 'Google Authentication failed');
            } finally {
                setLoading(false);
            }
        },
        onError: () => setError('Google Login Failed'),
    });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="auth-container"
        >
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="auth-header"
            >
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                    <button
                        onClick={() => navigate(`/login?role=seeker`)}
                        style={{
                            padding: '0.5rem 1.5rem',
                            border: '1px solid var(--border-subtle)',
                            background: roleParam === 'seeker' ? 'var(--glass-effect)' : 'transparent',
                            color: roleParam === 'seeker' ? 'var(--accent-electric)' : 'var(--text-dim)',
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            borderRadius: '2px'
                        }}
                    >
                        JOB SEEKER
                    </button>
                    <button
                        onClick={() => navigate(`/login?role=employer`)}
                        style={{
                            padding: '0.5rem 1.5rem',
                            border: '1px solid var(--border-subtle)',
                            background: roleParam === 'employer' ? 'var(--glass-effect)' : 'transparent',
                            color: roleParam === 'employer' ? 'var(--accent-gold)' : 'var(--text-dim)',
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            borderRadius: '2px'
                        }}
                    >
                        EMPLOYER
                    </button>
                </div>
                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle">Continue your professional narrative</p>
            </motion.div>

            {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-message">{error}</motion.div>}

            <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onSubmit={handleLogin}
            >
                <Input
                    label="Identifier"
                    name="emailOrUsername"
                    placeholder="Email or Username"
                    value={formData.emailOrUsername}
                    onChange={handleInputChange}
                    required={true}
                />

                <div style={{ position: 'relative' }}>
                    <Input
                        label="Credentials"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={true}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '38px',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-dim)'
                        }}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div style={{ textAlign: 'right', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
                    <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>Forgot password?</Link>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Authenticating...' : 'Sign In'}
                </button>

                <div className="divider">Or</div>

                <button type="button" className="btn-google" onClick={() => googleLogin()}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
                    Continue with Google
                </button>
            </motion.form>
        </motion.div>
    );
}
