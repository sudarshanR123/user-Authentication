import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Briefcase, Mail, Phone, MapPin, Plus, X, Upload } from 'lucide-react';
import client from '../api/client';

const JobSeekerProfile = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);
    const [resumeLoading, setResumeLoading] = useState(false);
    const [formData, setFormData] = useState({
        personalInfo: {
            fullName: '',
            bio: '',
            experience: '',
            skills: []
        },
        contactDetails: {
            phone: '',
            address: ''
        },
        resumeUrl: ''
    });
    const [tempSkill, setTempSkill] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await client.get(`/profile/${userId}`);
                if (res.data.success && res.data.type === 'job-seeker') {
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

    const addSkill = () => {
        if (tempSkill.trim() && !formData.personalInfo.skills.includes(tempSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                personalInfo: {
                    ...prev.personalInfo,
                    skills: [...prev.personalInfo.skills, tempSkill.trim()]
                }
            }));
            setTempSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                skills: prev.personalInfo.skills.filter(skill => skill !== skillToRemove)
            }
        }));
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('resume', file);

        setResumeLoading(true);
        try {
            const res = await client.post('/profile/upload-resume', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setFormData(prev => ({ ...prev, resumeUrl: res.data.resumeUrl }));
            }
        } catch (error) {
            alert('Failed to upload resume. Please try again.');
        } finally {
            setResumeLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await client.post('/profile/job-seeker', {
                userId,
                ...formData
            });
            if (res.data.success) {
                localStorage.setItem('userRole', 'seeker');
                navigate('/dashboard/seeker');
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
                    <h2 className="auth-title">Craft Your Narrative</h2>
                    <p className="auth-subtitle">Professional identity defined for the modern workforce</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {/* Personal Info */}
                        <div className="stagger-reveal">
                            <h3 style={{ fontSize: '0.8rem', color: 'var(--accent-electric)', marginBottom: '1.5rem', opacity: 1 }}>Identity</h3>

                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.personalInfo.fullName}
                                    onChange={(e) => handleInputChange(e, 'personalInfo')}
                                    required
                                    placeholder="e.g. Alex Rivera"
                                />
                            </div>

                            <div className="form-group">
                                <label>Professional Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.personalInfo.bio}
                                    onChange={(e) => handleInputChange(e, 'personalInfo')}
                                    rows="4"
                                    placeholder="Describe your professional journey..."
                                />
                            </div>

                            <div className="form-group">
                                <label>Experience Level</label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={formData.personalInfo.experience}
                                    onChange={(e) => handleInputChange(e, 'personalInfo')}
                                    placeholder="e.g. 5+ years in Fintech"
                                />
                            </div>
                        </div>

                        {/* Contact & Skills */}
                        <div className="stagger-reveal">
                            <h3 style={{ fontSize: '0.8rem', color: 'var(--accent-electric)', marginBottom: '1.5rem', opacity: 1 }}>Connectivity</h3>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.contactDetails.phone}
                                    onChange={(e) => handleInputChange(e, 'contactDetails')}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            <div className="form-group">
                                <label>Location / Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.contactDetails.address}
                                    onChange={(e) => handleInputChange(e, 'contactDetails')}
                                    placeholder="e.g. San Francisco, CA"
                                />
                            </div>

                            <div className="form-group">
                                <label>Core Skills</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        value={tempSkill}
                                        onChange={(e) => setTempSkill(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                        placeholder="Add a skill..."
                                        style={{ flex: 1 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={addSkill}
                                        style={{ padding: '0 1rem', background: 'var(--glass-effect)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', cursor: 'pointer' }}
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                    {formData.personalInfo.skills.map(skill => (
                                        <span key={skill} style={{ background: 'var(--accent-electric)', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {skill}
                                            <X size={12} onClick={() => removeSkill(skill)} style={{ cursor: 'pointer' }} />
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '2rem' }}>
                        <label>Resume / Curriculum Vitae</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="file"
                                onChange={handleResumeUpload}
                                style={{ display: 'none' }}
                                id="resume-upload"
                                accept=".pdf,.doc,.docx"
                            />
                            <label
                                htmlFor="resume-upload"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    padding: '2rem',
                                    border: '2px dashed var(--border-subtle)',
                                    borderRadius: 'var(--radius-sharp)',
                                    cursor: 'pointer',
                                    background: 'var(--glass-effect)',
                                    color: 'var(--text-dim)',
                                    textTransform: 'none'
                                }}
                            >
                                {resumeLoading ? 'Uploading...' : formData.resumeUrl ? '✅ Resume Uploaded' : <><Upload size={20} /> Click to upload professional document</>}
                            </label>
                            {formData.resumeUrl && (
                                <p style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', marginTop: '0.5rem' }}>
                                    Current file: {formData.resumeUrl.split('/').pop()}
                                </p>
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Finalizing Profile...' : 'Complete Profile Setup'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default JobSeekerProfile;
