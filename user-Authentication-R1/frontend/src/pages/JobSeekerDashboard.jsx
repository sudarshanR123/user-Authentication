import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, User, Send, Bell } from 'lucide-react';
import client from '../api/client';

const JobSeekerDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');
    const storedName = localStorage.getItem('userName');

    // Fix: Ensure we don't display "undefined" as a string
    const initialName = (storedName && storedName !== 'undefined') ? storedName : 'Talent';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch profile to get real name and status
                const profileRes = await client.get(`/profile/${userId}`);
                if (profileRes.data.success) {
                    setProfile(profileRes.data.profile);
                }

                // Fetch real jobs
                const jobsRes = await client.get('/jobs');
                if (jobsRes.data.success) {
                    setJobs(jobsRes.data.jobs); // Show all fetched jobs
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchDashboardData();
    }, [userId]);

    const handleApply = async (jobId) => {
        try {
            const res = await client.post('/applications', { jobId, seekerId: userId });
            if (res.data.success) {
                alert('Application submitted successfully!');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting application');
        }
    };

    const userName = profile?.personalInfo?.fullName || initialName;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <motion.h4
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '0.5rem' }}
                    >
                        CANDIDATE COMMAND
                    </motion.h4>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: '2.5rem', textTransform: 'uppercase' }}
                    >
                        Welcome, {userName}
                    </motion.h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="glass-panel" style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'var(--glass-effect)' }}>
                        <Bell size={20} color="var(--text-dim)" />
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {[
                    { label: 'Applications', value: '0', icon: <Send size={20} /> },
                    { label: 'Interviews', value: '0', icon: <Briefcase size={20} /> },
                    { label: 'Profile Views', value: '0', icon: <User size={20} /> }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="stat-card"
                        style={{ background: 'var(--bg-card)', padding: '2rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sharp)' }}
                    >
                        <div style={{ color: 'var(--accent-electric)', marginBottom: '1rem' }}>{stat.icon}</div>
                        <div style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.25rem' }}>{stat.value}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ background: 'var(--bg-card)', padding: '2rem', border: '1px solid var(--border-subtle)' }}
                >
                    <h3 style={{ marginBottom: '2rem', fontSize: '1rem' }}>Explore Opportunities</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {jobs.length > 0 ? jobs.map(job => (
                            <div key={job._id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{job.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{job.company} • {job.location}</div>
                                </div>
                                <button
                                    onClick={() => handleApply(job._id)}
                                    style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold)', padding: '4px 12px', textTransform: 'uppercase', background: 'transparent', cursor: 'pointer' }}
                                >
                                    Apply Now
                                </button>
                            </div>
                        )) : (
                            <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem' }}>No active opportunities at the moment.</div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    style={{ background: 'var(--bg-card)', padding: '2rem', border: '1px solid var(--border-subtle)' }}
                >
                    <h3 style={{ marginBottom: '2rem', fontSize: '1rem' }}>Narrative Status</h3>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', color: 'var(--accent-electric)', marginBottom: '1rem' }}>{profile ? '100%' : '15%'}</div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '2rem' }}>
                            {profile ? 'Your professional story is complete. You are highly visible to recruiters.' : 'Your profile is just a skeleton. Complete your portfolio to stand out.'}
                        </p>
                        <button className="btn-primary" style={{ padding: '0.75rem' }} onClick={() => window.location.href = '/profile/seeker'}>
                            {profile ? 'Edit Profile' : 'Refine Profile'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default JobSeekerDashboard;

