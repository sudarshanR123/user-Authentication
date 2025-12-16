import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import Input from '../components/Input';
import { Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

export default function Login() {
    // ... (state remains same)
    const [formData, setFormData] = useState({
        emailOrUsername: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        // ... (login logic remains same)
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await client.post('/login', formData);
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                alert('Login Successful!');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Login failed. Please check your network or server.');
        } finally {
            setLoading(false);
        }
    };

    // Use the hook to trigger Google Popup
    const googleLogin = useGoogleLogin({
        onSuccess: tokenResponse => {
            console.log(tokenResponse);
            // In a real app, send tokenResponse.access_token to backend to verify and create session
            alert('Google Account Selected! Access Token received.');
            // call backend here with token
        },
        onError: () => setError('Google Login Failed'),
    });

    return (
        <div className="auth-container">
            {/* ... (header remains same) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="auth-title" style={{ marginBottom: 0 }}>Login</h2>
                <Link to="/register" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: '500' }}>Register</Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* ... (inputs remain same) */}
                <Input
                    label="Email ID/Username"
                    name="emailOrUsername"
                    placeholder="Enter Email ID/Username"
                    value={formData.emailOrUsername}
                    onChange={handleInputChange}
                    required={true}
                />

                <div style={{ position: 'relative' }}>
                    <Input
                        label="Password"
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
                            color: '#9ca3af'
                        }}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div style={{ textAlign: 'right', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
                    <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Fortgot password?</Link>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <div className="divider">Or</div>

                <button type="button" className="btn-google" onClick={() => googleLogin()}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px', marginRight: '8px' }} />
                    Sign in with Google
                </button>
            </form>
        </div>
    );
}
