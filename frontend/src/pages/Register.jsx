import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import Input from '../components/Input';
import { Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

export default function Register() {
    // ... (rest remains same until return)
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

    // Redefining handleChange properly requires 'name' prop on Input.
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { fullName, email, password, mobile } = formData;
            const res = await client.post('/register', {
                username: fullName,
                email,
                password,
                mobile
            });

            if (res.data.success) {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
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
            <div className="auth-header">
                <h2 className="auth-title">Create your jobSpark profile</h2>
                <p className="auth-subtitle">Find and apply to top jobs across India's leading job platform</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <Input
                    label="Full name"
                    name="fullName"
                    placeholder="What is your name?"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required={true}
                />
                <Input
                    label="Email ID"
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
                        placeholder="(Minimum 6 characters)"
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

                <Input
                    label="Mobile number"
                    type="tel"
                    name="mobile"
                    placeholder="+91 Enter your mobile number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required={true}
                />

                <div className="checkbox-group">
                    <input type="checkbox" id="updates" />
                    <label htmlFor="updates" style={{ fontWeight: 'normal', marginBottom: 0 }}>
                        Send me important updates & promotions via SMS, email, and WhatsApp
                    </label>
                </div>

                <p style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '1rem', textAlign: 'center' }}>
                    By clicking Register, you agree to the Terms and Conditions & Privacy Policy of jobSpark.com
                </p>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Registering...' : 'Register now'}
                </button>

                <div className="link-center">
                    Already have an account? <Link to="/login">Login here</Link>
                </div>

                <div className="divider">Or</div>

                <button type="button" className="btn-google" onClick={() => googleLogin()}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px', marginRight: '10px' }} />
                    Continue with Google
                </button>
            </form>
        </div>
    );
}
