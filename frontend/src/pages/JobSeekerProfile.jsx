import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import { motion } from 'framer-motion';

const JobSeekerProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        bio: '',
        experience: '',
        skills: '',
        phone: '',
        address: ''
    });
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let resumeUrl = '';
            if (resume) {
                const fileData = new FormData();
                fileData.append('resume', resume);
                const uploadRes = await axios.post('http://localhost:3000/api/profile/upload-resume', fileData);
                resumeUrl = uploadRes.data.resumeUrl;
            }

            const userId = localStorage.getItem('userId'); // Assuming userId is stored after login
            await axios.post('http://localhost:3000/api/profile/job-seeker', {
                userId,
                personalInfo: {
                    fullName: formData.fullName,
                    bio: formData.bio,
                    experience: formData.experience,
                    skills: formData.skills.split(',').map(s => s.trim())
                },
                contactDetails: {
                    phone: formData.phone,
                    address: formData.address
                },
                resumeUrl
            });

            alert('Profile updated successfully!');
            navigate('/'); // Redirect to login or dashboard
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="auth-container"
            style={{ maxWidth: '600px' }}
        >
            <div className="auth-header">
                <h2 className="auth-title">Talent Profile</h2>
                <p className="auth-subtitle">Craft your professional identity</p>
            </div>
            <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSubmit}
            >
                <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
                <div className="form-group">
                    <label>Bio & Narrative</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="3"
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sharp)', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none' }}
                    />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <Input
                        label="Experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                    />
                    <Input
                        label="Expertise / Skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="React, Design, etc."
                    />
                </div>
                <Input
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
                <div className="form-group">
                    <label>Location / Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="2"
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sharp)', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none' }}

                    />
                </div>
                <div className="form-group">
                    <label>Resume (PDF/Doc)</label>
                    <input type="file" onChange={handleFileChange} style={{ background: 'none', border: 'none', padding: 0 }} />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Committing Changes...' : 'Save Narrative'}
                </button>
            </motion.form>
        </motion.div>
    );
};

export default JobSeekerProfile;
