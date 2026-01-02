import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import { motion } from 'framer-motion';

const EmployerProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        companyName: '',
        website: '',
        industry: '',
        description: '',
        phone: '',
        address: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            await axios.post('http://localhost:3000/api/profile/employer', {
                userId,
                companyInfo: {
                    companyName: formData.companyName,
                    website: formData.website,
                    industry: formData.industry,
                    description: formData.description
                },
                contactDetails: {
                    phone: formData.phone,
                    address: formData.address,
                    email: formData.email
                }
            });

            alert('Employer profile updated successfully!');
            navigate('/');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="auth-container"
            style={{ maxWidth: '600px' }}
        >
            <div className="auth-header">
                <h2 className="auth-title">Entity Profile</h2>
                <p className="auth-subtitle">Establish your company narrative</p>
            </div>
            <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSubmit}
            >
                <Input
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <Input
                        label="Website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                    />
                    <Input
                        label="Industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Company Vision / Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sharp)', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none' }}
                    />
                </div>
                <Input
                    label="Corporate Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <Input
                    label="Business Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
                <div className="form-group">
                    <label>Headquarters</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="2"
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sharp)', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none' }}
                    />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Committing changes...' : 'Finalize Profile'}
                </button>
            </motion.form>
        </motion.div>
    );
};

export default EmployerProfile;
