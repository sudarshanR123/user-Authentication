import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ maxWidth: '900px' }}
            >
                <motion.h1
                    initial={{ letterSpacing: '15px', opacity: 0 }}
                    animate={{ letterSpacing: '4px', opacity: 1 }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    style={{ fontSize: 'clamp(2rem, 8vw, 5rem)', marginBottom: '1.5rem', lineHeight: 1.1 }}
                >
                    CRAFT YOUR <br />
                    <span style={{ color: 'var(--accent-electric)' }}>FUTURE</span> CAREER
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    style={{ fontSize: '1.2rem', color: 'var(--text-dim)', marginBottom: '3rem', fontWeight: 300, letterSpacing: '1px' }}
                >
                    Where intentional design meets human potential. Connect with industry leaders who value craft over conventions.
                </motion.p>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}
                >
                    <Link to="/register?role=seeker" className="btn-primary" style={{ padding: '1.25rem 2.5rem', textDecoration: 'none', width: 'auto' }}>
                        Find Work
                    </Link>
                    <Link to="/register?role=employer" className="btn-primary" style={{
                        padding: '1.25rem 2.5rem',
                        textDecoration: 'none',
                        width: 'auto',
                        backgroundColor: '#333',
                        border: '1px solid var(--accent-gold)',
                        color: 'var(--accent-gold)'
                    }}>
                        Hire Talent
                    </Link>
                </motion.div>
            </motion.div>

            {/* Background Decorative Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 8, repeat: Infinity }}
                style={{
                    position: 'absolute',
                    top: '20%', right: '10%',
                    width: '300px', height: '300px',
                    borderRadius: '50%',
                    background: 'var(--accent-electric)',
                    filter: 'blur(100px)',
                    zIndex: -1
                }}
            />
        </div>
    );
};

export default Home;
