import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Globe, Phone, MapPin, Briefcase } from 'lucide-react';
import client from '../api/client';

const EmployerProfile = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyInfo: {
            companyName: '',
            website: '',
            industry: '',
            description: ''
        },
        contactDetails: {
            phone: '',
            address: '',
            email: ''
        }
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await client.get(`/profile/${userId}`);
                if (res.data.success && res.data.type === 'employer') {
                    setFormData(res.data.profile);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        if (userId) fetchProfile();
    }, [userId]);

    const handleInputChange = (e, section) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await client.post('/api/profile/employer', {
                userId,
                ...formData
            });
            if (res.data.success) {
                localStorage.setItem('userRole', 'employer');
                navigate('/dashboard/employer');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Error saving profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 2rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-container"
                style={{ maxWidth: '100%', padding: '3rem' }}
            >
                <div className="auth-header">
                    <h2 className="auth-title">Corporate Infrastructure</h2>
                    <p className="auth-subtitle">Define your organization's presence in the ecosystem</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {/* Company Info */}
                        <div className="stagger-reveal">
                            <h3 style={{ fontSize: '0.8rem', color: 'var(--accent-electric)', marginBottom: '1.5rem', opacity: 1 }}>Organization</h3>

                            <div className="form-group">
                                <label>Company Name</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyInfo.companyName}
                                    onChange={(e) => handleInputChange(e, 'companyInfo')}
                                    required
                                    placeholder="e.g. Nexus Systems"
                                />
                            </div>

                            <div className="form-group">
                                <label>Industry</label>
                                <input
                                    type="text"
                                    name="industry"
                                    value={formData.companyInfo.industry}
                                    onChange={(e) => handleInputChange(e, 'companyInfo')}
                                    placeholder="e.g. Artificial Intelligence"
                                />
                            </div>

                            <div className="form-group">
                                <label>Company Mission / Description</label>
                                <textarea
                                    name="description"
                                    value={formData.companyInfo.description}
                                    onChange={(e) => handleInputChange(e, 'companyInfo')}
                                    rows="4"
                                    placeholder="Describe your corporate vision..."
                                />
                            </div>
                        </div>

                        {/* Contact & Presence */}
                        <div className="stagger-reveal">
                            <h3 style={{ fontSize: '0.8rem', color: 'var(--accent-electric)', marginBottom: '1.5rem', opacity: 1 }}>Presence</h3>

                            <div className="form-group">
                                <label>Professional Website</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.companyInfo.website}
                                    onChange={(e) => handleInputChange(e, 'companyInfo')}
                                    placeholder="https://nexus.systems"
                                />
                            </div>

                            <div className="form-group">
                                <label>Headquarters Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.contactDetails.email}
                                    onChange={(e) => handleInputChange(e, 'contactDetails')}
                                    placeholder="contact@nexus.systems"
                                />
                            </div>

                            <div className="form-group">
                                <label>Contact Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.contactDetails.phone}
                                    onChange={(e) => handleInputChange(e, 'contactDetails')}
                                    placeholder="+1 (555) 999-0000"
                                />
                            </div>

                            <div className="form-group">
                                <label>Global Headquarters</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.contactDetails.address}
                                    onChange={(e) => handleInputChange(e, 'contactDetails')}
                                    placeholder="e.g. Austin, TX"
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Establishing Infrastructure...' : 'Launch Corporate Profile'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EmployerProfile;
