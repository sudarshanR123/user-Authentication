import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Plus, Search } from 'lucide-react';

const EmployerDashboard = () => {
    const userName = localStorage.getItem('userName') || 'Partner';

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <motion.h4
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '0.5rem' }}
                    >
                        ENTITY CONTROL
                    </motion.h4>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: '2.5rem' }}
                    >
                        Welcome, {userName}
                    </motion.h1>
                </div>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto', padding: '0.75rem 1.5rem' }}>
                    <Plus size={18} /> Post New Opportunity
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {[
                    { label: 'Total Candidates', value: '482', icon: <Users size={20} /> },
                    { label: 'Active Jobs', value: '14', icon: <FileText size={20} /> },
                    { label: 'Unread Applications', value: '28', icon: <Search size={20} /> }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        style={{ background: 'var(--bg-card)', padding: '2rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sharp)' }}
                    >
                        <div style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>{stat.icon}</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>{stat.value}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '2rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem' }}>Top Talent Proposals</h3>
                    <button style={{ background: 'none', border: 'none', color: 'var(--accent-electric)', fontSize: '0.8rem', cursor: 'pointer' }}>View All</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                    {[1, 2].map(item => (
                        <div key={item} style={{ padding: '1.5rem', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--accent-electric), var(--accent-gold))' }}></div>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Alex Rivera</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Senior Frontend Engineer</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>Matched with 98% compatibility for your 'UI Architect' role.</div>
                            <button style={{ width: '100%', padding: '0.5rem', background: 'var(--glass-effect)', border: '1px solid var(--border-subtle)', color: 'white', cursor: 'pointer' }}>View Resume</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
