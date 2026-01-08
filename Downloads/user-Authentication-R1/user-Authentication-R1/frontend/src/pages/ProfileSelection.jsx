import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProfileSelection = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'seeker') {
            navigate('/dashboard/seeker');
        } else if (userRole === 'employer') {
            navigate('/dashboard/employer');
        }
    }, [navigate]);

    const selectRole = (role) => {
        localStorage.setItem('userRole', role); // Persist selection
        if (role === 'seeker') {
            navigate('/dashboard/seeker');
        } else {
            navigate('/dashboard/employer');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="auth-container"
        >
            <div className="auth-header">
                <h2 className="auth-title">Define Your Identity</h2>
                <p className="auth-subtitle">Are you here to build projects or build careers?</p>
            </div>
            <div className="role-options" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectRole('seeker')}
                    className="btn-primary"
                    style={{ flex: 1 }}
                >
                    Job Seeker
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectRole('employer')}
                    className="btn-primary"
                    style={{ flex: 1, backgroundColor: '#333' }}
                >
                    Employer
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ProfileSelection;
