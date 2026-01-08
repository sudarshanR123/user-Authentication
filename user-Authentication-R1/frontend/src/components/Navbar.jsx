import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    const [activeDropdown, setActiveDropdown] = React.useState(null); // 'login' or 'join'

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const getDashboardPath = () => {
        if (userRole === 'seeker') return '/dashboard/seeker';
        if (userRole === 'employer') return '/dashboard/employer';
        return '/profile/select';
    };

    const DropdownMenu = ({ type }) => {
        const isJoin = type === 'join';
        return (
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '1rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.5rem',
                    minWidth: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    zIndex: 1100
                }}
            >
                <Link
                    to={isJoin ? "/register?role=seeker" : "/login?role=seeker"}
                    className="dropdown-item"
                    onClick={() => setActiveDropdown(null)}
                >
                    Find Work
                </Link>
                <Link
                    to={isJoin ? "/register?role=employer" : "/login?role=employer"}
                    className="dropdown-item"
                    onClick={() => setActiveDropdown(null)}
                >
                    Hire Now
                </Link>
            </motion.div>
        );
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 50 }}
            style={{
                position: 'fixed',
                top: 0, width: '100%',
                padding: '1.5rem 3rem',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(10, 10, 11, 0.8)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}
        >
            <Link to="/" style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontSize: '1.2rem',
                letterSpacing: '4px'
            }}>
                JOBSPARK<span style={{ color: 'var(--accent-electric)' }}>.</span>
            </Link>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link to="/" className="nav-link">Home</Link>
                {isLoggedIn ? (
                    <>
                        <Link to={getDashboardPath()} className="nav-link">Dashboard</Link>
                        <Link to="/profile/select" className="nav-link">Identity</Link>
                        <button onClick={handleLogout} className="btn-primary" style={{ padding: '0.5rem 1.5rem', width: 'auto' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <div style={{ position: 'relative' }}
                            onMouseEnter={() => setActiveDropdown('login')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <span className="nav-link" style={{ cursor: 'pointer' }}>Login</span>
                            <AnimatePresence>
                                {activeDropdown === 'login' && <DropdownMenu type="login" />}
                            </AnimatePresence>
                        </div>

                        <div style={{ position: 'relative' }}
                            onMouseEnter={() => setActiveDropdown('join')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className="btn-primary" style={{ padding: '0.5rem 1.5rem', width: 'auto' }}>Join Us</button>
                            <AnimatePresence>
                                {activeDropdown === 'join' && <DropdownMenu type="join" />}
                            </AnimatePresence>
                        </div>
                    </>
                )}
            </div>

            <style>{`
                .nav-link {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: var(--text-dim);
                    text-decoration: none;
                    transition: color 0.3s;
                }
                .nav-link:hover {
                    color: var(--accent-gold);
                }
                .dropdown-item {
                    padding: 0.75rem 1rem;
                    font-size: 0.7rem;
                    color: var(--text-dim);
                    text-decoration: none;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.2s;
                }
                .dropdown-item:hover {
                    background: var(--glass-effect);
                    color: var(--accent-electric);
                }
            `}</style>
        </motion.nav>
    );
};

export default Navbar;
