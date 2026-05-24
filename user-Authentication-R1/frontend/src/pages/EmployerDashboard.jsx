import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Plus, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const EmployerDashboard = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState({ activeListings: 0, totalApplications: 0, shortlisted: 0 });
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName') || 'Partner';

    useEffect(() => {
        const fetchEmployerData = async () => {
            try {
                // Fetch stats
                const statsRes = await client.get(`/employer/stats/${userId}`);
                if (statsRes.data.success) {
                    setStats(statsRes.data.stats);
                }

                // Fetch jobs
                const res = await client.get(`/jobs/employer/${userId}`);
                if (res.data.success) {
                    setJobs(res.data.jobs);
                }
            } catch (error) {
                console.error('Error fetching employer data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchEmployerData();
    }, [userId]);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-gold)', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>
                        <LayoutDashboard size={14} /> EMPLOYER CONSOLE
                    </div>
                    <h1 style={{ fontSize: '2.5rem', textTransform: 'uppercase' }}>HQ: {userName}</h1>
                </div>
                <button
                    onClick={() => navigate('/jobs/post')}
                    className="btn-primary"
                    style={{ width: 'auto', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                    <Plus size={20} /> Post New Role
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {[
                    { label: 'Active Listings', value: stats.activeListings, icon: <Briefcase /> },
                    { label: 'Total Applications', value: stats.totalApplications, icon: <Users /> },
                    { label: 'Shortlisted', value: stats.shortlisted, icon: <Users /> }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{ background: 'var(--bg-card)', padding: '2rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sharp)' }}
                    >
                        <div style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>{stat.icon}</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>{stat.value}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '2rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem' }}>Recent Postings</h3>
                    <button style={{ background: 'none', border: 'none', color: 'var(--accent-electric)', cursor: 'pointer', fontSize: '0.8rem' }}>View All</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {jobs.length > 0 ? jobs.map(job => (
                        <div key={job._id} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{job.title}</h4>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{job.location} • {job.type} • Posted {new Date(job.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', cursor: 'pointer' }}>Edit</button>
                                <button
                                    className="btn-primary"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', width: 'auto' }}
                                    onClick={() => navigate(`/jobs/applicants/${job._id}`)}
                                >
                                    View Applicants
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                            <p>You haven't posted any jobs yet.</p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                                <button
                                    onClick={() => navigate('/jobs/post')}
                                    style={{ color: 'var(--accent-gold)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Post your first job now
                                </button>
                                <span>or</span>
                                <button
                                    onClick={async () => {
                                        try {
                                            const res = await client.post('/jobs/seed', { employerId: userId });
                                            if (res.data.success) {
                                                window.location.reload();
                                            }
                                        } catch (error) {
                                            console.error("Error seeding jobs:", error);
                                            alert("Failed to seed jobs. Check backend console.");
                                        }
                                    }}
                                    style={{ color: 'var(--accent-electric)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Seed 20 Sample Jobs
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;

