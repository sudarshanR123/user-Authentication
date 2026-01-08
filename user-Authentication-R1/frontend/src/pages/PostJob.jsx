import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import Input from '../components/Input';
import { motion } from 'framer-motion';

const PostJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        salary: '',
        type: 'Full-time',
        description: '',
        requirements: ''
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
            await client.post('/jobs', {
                employerId: userId,
                ...formData,
                requirements: formData.requirements.split(',').map(r => r.trim())
            });

            alert('Job posted successfully!');
            navigate('/dashboard/employer');
        } catch (error) {
            console.error('Error posting job:', error);
            alert('Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="auth-container"
            style={{ maxWidth: '800px' }}
        >
            <div className="auth-header">
                <h2 className="auth-title">Post a New Role</h2>
                <p className="auth-subtitle">Define the next architect of your company</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <Input
                        label="Job Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Company Name"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <Input
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                    <div className="form-group">
                        <label>Engagement Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sharp)', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none' }}
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>
                </div>
                <Input
                    label="Salary Range (Optional)"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g. $100k - $150k"
                />
                <div className="form-group">
                    <label>Role Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        required
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sharp)', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none' }}
                    />
                </div>
                <div className="form-group">
                    <label>Key Requirements (Comma separated)</label>
                    <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleChange}
                        rows="2"
                        placeholder="React, AWS, 5+ years experience"
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sharp)', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none' }}
                    />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Publishing...' : 'Publish Job Listing'}
                </button>
            </form>
        </motion.div>
    );
};

export default PostJob;
