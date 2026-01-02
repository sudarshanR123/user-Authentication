import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, User, Send, Bell } from 'lucide-react';

const JobSeekerDashboard = () => {
    const userName = localStorage.getItem('userName') || 'Talent';

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
                        style={{ fontSize: '2.5rem' }}
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
                    { label: 'Applications', value: '12', icon: <Send size={20} /> },
                    { label: 'Interviews', value: '3', icon: <Briefcase size={20} /> },
                    { label: 'Profile Views', value: '142', icon: <User size={20} /> }
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
                    <h3 style={{ marginBottom: '2rem', fontSize: '1rem' }}>Active Applications</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[1, 2, 3].map(item => (
                            <div key={item} style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Senior Product Designer</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Linear • Remote</div>
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold)', padding: '2px 8px', textTransform: 'uppercase' }}>In Review</div>
                            </div>
                        ))}
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
                        <div style={{ fontSize: '3rem', color: 'var(--accent-electric)', marginBottom: '1rem' }}>85%</div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '2rem' }}>Your professional story is almost complete. Complete your portfolio to stand out.</p>
                        <button className="btn-primary" style={{ padding: '0.75rem' }}>Refine Profile</button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default JobSeekerDashboard;
