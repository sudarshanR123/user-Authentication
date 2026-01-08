import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ListFilter,
    PlusSquare,
    ClipboardEdit,
    Users,
    MessageSquare,
    FileSpreadsheet,
    Calendar,
    BarChart3,
    Settings,
    ChevronRight,
    Search
} from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarSection = ({ title, children }) => (
    <div className="sidebar-section">
        <h3 className="section-title">{title}</h3>
        {children}
    </div>
);

const SidebarItem = ({ icon: Icon, label, to, badge }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
    >
        <div className="item-content">
            <Icon size={18} className="item-icon" />
            <span className="item-label">{label}</span>
        </div>
        {badge && <span className="item-badge">{badge}</span>}
        <ChevronRight size={14} className="chevron" />
    </NavLink>
);

const Sidebar = () => {
    return (
        <aside className="jobspark-sidebar">
            <div className="sidebar-header">
                <div className="logo-container">
                    <span className="logo-text">job<span className="logo-accent">Spark</span></span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <SidebarSection title="Main">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard/employer" />
                </SidebarSection>

                <SidebarSection title="Job Board">
                    <SidebarItem icon={ListFilter} label="Listing" to="/jobs/listing" />
                    <SidebarItem icon={PlusSquare} label="Create a Job" to="/jobs/create" />
                    <SidebarItem icon={ClipboardEdit} label="View & Edit" to="/jobs/edit" />
                </SidebarSection>

                <SidebarSection title="Talent Management">
                    <SidebarItem icon={Users} label="Candidates" to="/candidates" />
                    <SidebarItem icon={MessageSquare} label="Interviews" to="/interviews" />
                </SidebarSection>

                <SidebarSection title="Tools">
                    <SidebarItem icon={FileSpreadsheet} label="Survey Builder" to="/tools/survey" />
                    <SidebarItem icon={Calendar} label="Events" to="/tools/events" />
                    <SidebarItem icon={BarChart3} label="Analytics" to="/tools/analytics" />
                    <SidebarItem icon={Settings} label="Settings" to="/tools/settings" />
                </SidebarSection>
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <img src="https://i.pravatar.cc/150?u=johndoe" alt="User" className="user-avatar" />
                    <div className="user-info">
                        <span className="user-name">John Doe</span>
                        <span className="user-email">johndoe@gmail.com</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
