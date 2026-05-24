import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, FileText, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import client from '../api/client';

const ViewApplicants = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [jobTitle, setJobTitle] = useState('');

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                // Fetch job info to get title (optional but better UX)
                const jobsRes = await client.get('/jobs');
                const job = jobsRes.data.jobs.find(j => j._id === jobId);
                if (job) setJobTitle(job.title);

                const res = await client.get(`/applications/job/${jobId}`);
                if (res.data.success) {
                    setApplicants(res.data.applications);
                }
            } catch (error) {
                console.error('Error fetching applicants:', error);
            } finally {
                setLoading(false);
            }
        };

        if (jobId) fetchApplicants();
    }, [jobId]);

    const updateStatus = async (appId, status) => {
        try {
            const res = await client.patch(`/applications/${appId}`, { status });
            if (res.data.success) {
                setApplicants(prev => prev.map(app =>
                    app._id === appId ? { ...app, status } : app
                ));
            }
        } catch (error) {
            alert('Failed to update status');
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}
                >
                    <ArrowLeft size={16} /> BACK TO CONSOLE
                </button>
                <motion.h4
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '0.5rem' }}
                >
                    APPLICANT ROSTER
                </motion.h4>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '2.5rem', textTransform: 'uppercase' }}
                >
                    {jobTitle || 'Role'} Applicants
                </motion.h1>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-dim)' }}>Scanning Database...</div>
            ) : applicants.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-panel"
                    style={{ textAlign: 'center', padding: '5rem', border: '1px solid var(--border-subtle)', background: 'var(--glass-effect)' }}
                >
                    <p style={{ color: 'var(--text-dim)' }}>The roster is currently empty. No candidates have responded to this listing yet.</p>
                </motion.div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <AnimatePresence>
                        {applicants.map((app, index) => (
                            <motion.div
                                key={app._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="applicant-card"
                                style={{
                                    background: 'var(--bg-card)',
                                    padding: '2rem',
                                    border: '1px solid var(--border-subtle)',
                                    display: 'grid',
                                    gridTemplateColumns: 'auto 1fr auto',
                                    gap: '2rem',
                                    alignItems: 'center'
                                }}
                            >
                                <div style={{ width: '60px', height: '60px', background: 'var(--glass-effect)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--accent-electric)', border: '1px solid var(--border-subtle)' }}>
                                    <User size={30} />
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-body)', textTransform: 'none', letterSpacing: 'normal' }}>
                                        {app.profile?.personalInfo?.fullName || app.seekerId?.username}
                                        <span style={{ marginLeft: '1rem', fontSize: '0.7rem', verticalAlign: 'middle', padding: '2px 8px', borderRadius: '2px', background: app.status === 'shortlisted' ? 'rgba(34, 197, 94, 0.1)' : app.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)', color: app.status === 'shortlisted' ? '#22c55e' : app.status === 'rejected' ? '#ef4444' : 'var(--text-dim)', border: '1px solid currentColor' }}>
                                            {app.status.toUpperCase()}
                                        </span>
                                    </h3>
                                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Mail size={14} /> {app.seekerId?.email}</div>
                                        {app.seekerId?.mobile && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={14} /> {app.seekerId.mobile}</div>}
                                        {app.profile?.contactDetails?.address && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} /> {app.profile.contactDetails.address}</div>}
                                    </div>
                                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-primary)', opacity: 0.8 }}>
                                        {app.profile?.personalInfo?.bio || 'No bio provided.'}
                                    </p>
                                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                        {app.profile?.personalInfo?.skills.map((skill, i) => (
                                            <span key={i} style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'var(--glass-effect)', border: '1px solid var(--border-subtle)', borderRadius: '2px', color: 'var(--accent-gold)' }}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {app.profile?.resumeUrl && (
                                        <a
                                            href={`http://localhost:3000${app.profile.resumeUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-primary"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--accent-electric)' }}
                                        >
                                            <FileText size={14} /> VIEW CV
                                        </a>
                                    )}
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => updateStatus(app._id, 'shortlisted')}
                                            style={{ flex: 1, padding: '0.5rem', background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '1px solid #22c55e', cursor: 'pointer', borderRadius: '4px' }}
                                            title="Shortlist"
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                        <button
                                            onClick={() => updateStatus(app._id, 'rejected')}
                                            style={{ flex: 1, padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444', cursor: 'pointer', borderRadius: '4px' }}
                                            title="Reject"
                                        >
                                            <XCircle size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default ViewApplicants;
