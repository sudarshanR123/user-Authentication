import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import client from '../api/client';
import Input from '../components/Input';
import { Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        mobile: ''
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { fullName, email, password, mobile } = formData;
            const response = await client.post('/register', {
                username: fullName,
                email,
                password,
                mobile,
                role: roleParam
            });
            if (response.data.success) {
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
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: tokenResponse => {
            console.log(tokenResponse);
            alert('Google Account Selected! Access Token received.');
        },
        onError: () => setError('Google Login Failed'),
    });

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
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
                        onClick={() => navigate(`/register?role=seeker`)}
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
                        onClick={() => navigate(`/register?role=employer`)}
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
                <h2 className="auth-title">Craft Your Identity</h2>
                <p className="auth-subtitle">Begin your legendary professional journey</p>
            </motion.div>

            {error && <div className="error-message">{error}</div>}

            <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onSubmit={handleSubmit}
            >
                <Input
                    label="Full Name"
                    name="fullName"
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required={true}
                />
                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="Tell us your Email ID"
                    value={formData.email}
                    onChange={handleInputChange}
                    required={true}
                />
                <div style={{ position: 'relative' }}>
                    <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Secure your account"
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

                <Input
                    label="Mobile number"
                    type="tel"
                    name="mobile"
                    placeholder="+91 Enter your number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required={true}
                />

                <div className="checkbox-group" style={{ marginBottom: '1.5rem', display: 'flex', gap: '10px' }}>
                    <input type="checkbox" id="updates" style={{ width: 'auto' }} />
                    <label htmlFor="updates" style={{ textTransform: 'none', color: 'var(--text-dim)', fontSize: '0.75rem', marginBottom: 0 }}>
                        I agree to receive the latest opportunities & updates.
                    </label>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Processing...' : 'Create Account'}
                </button>

                <div className="link-center">
                    Already a member? <Link to="/login">Sign In</Link>
                </div>

                <div className="divider">Or</div>

                <button type="button" className="btn-google" onClick={() => googleLogin()}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
                    Continue with Google
                </button>
            </motion.form>
        </motion.div>
    );
}
