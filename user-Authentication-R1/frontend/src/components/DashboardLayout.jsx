import React from 'react';
import Sidebar from './Sidebar';
import { Search, Bell } from 'lucide-react';

const DashboardLayout = ({ children, title = "View & Edit" }) => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-left">
                        <h1 className="page-title">{title}</h1>
                    </div>
                    <div className="header-right">
                        <div className="search-bar">
                            <Search size={18} className="search-icon" />
                            <input type="text" placeholder="Search" />
                        </div>
                        <button className="notification-btn">
                            <Bell size={20} />
                            <span className="notification-badge">2</span>
                        </button>
                    </div>
                </header>
                <section className="dashboard-content">
                    {children}
                </section>
                <footer className="dashboard-footer-bar">
                    <div className="footer-logo">job<span>Spark</span></div>
                    <nav className="footer-links">
                        <a href="#">About us</a>
                        <a href="#">Careers</a>
                        <a href="#">Employer home</a>
                        <a href="#">Sitemap</a>
                        <a href="#">Credits</a>
                    </nav>
                    <nav className="footer-links">
                        <a href="#">Help center</a>
                        <a href="#">Guidelines for safe job search</a>
                        <a href="#">post a job</a>
                        <a href="#">Report issue</a>
                    </nav>
                    <nav className="footer-links">
                        <a href="#">Privacy policy</a>
                        <a href="#">Terms & conditions</a>
                        <a href="#">Fraud alert</a>
                        <a href="#">Trust & safety</a>
                    </nav>
                    <div className="footer-copyright">
                        @ copyright 2025 jobSpark
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default DashboardLayout;
