import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    FileText,
    UserCheck,
    ChevronRight,
    X,
    Plus,
    Eye
} from 'lucide-react';

const MultiStepJobForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: 'Front-End Developer',
        field: 'Investment Banking',
        sectors: ['Retail Banker', 'Corporate Banker'],
        industry: 'Finance',
        salaryRange: '₹ 45000 - 60000',
        salaryType: 'Monthly',
        companyName: 'Kotak Mahindra Bank',
        deadline: '2025-12-31',
        jobType: 'Full-Time',
        location: 'Bengaluru, Karnataka',
        aboutCompany: 'Kotak Mahindra Bank is one of India\'s leading private sector banks...',
        jobOverview: '',
        responsibilities: [
            'Develop and maintain user-facing features',
            'Collaborate with designers and backend teams',
            'Optimize applications for performance'
        ],
        requirements: [
            'HTML, CSS, JavaScript',
            '1+ years of experience',
            'Bachelor\'s degree (preferred)'
        ],
        experienceLevel: 'Fresher',
        workMode: 'Remote',
        benefits: ['Health insurance', 'Paid leave', 'Performance bonuses'],
        learningOps: '',
        candidateSummary: 'We are looking for a motivated individual with strong problem-solving skills...',
        idealSkills: ['Problem-solving', 'Attention to detail', 'Team collaboration', 'Time management'],
        traits: ['Self-motivated', 'Adaptable', 'Detail-oriented', 'Willing to learn'],
        education: ['Bachelor\'s degree in Computer Science', 'Relevant certifications'],
        communication: 'Excellent',
        availability: 'Immediate'
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const steps = [
        { id: 1, label: 'Job Details', icon: Briefcase },
        { id: 2, label: 'Job Description', icon: FileText },
        { id: 3, label: 'Ideal candidate info', icon: UserCheck },
    ];

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="step-content"
                    >
                        <div className="form-title-row">
                            <h2 className="form-section-title"><Briefcase size={20} /> Job Details</h2>
                            <button className="overview-btn"><Eye size={16} /> Overview</button>
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input className="form-input" value={formData.title} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Field of Work</label>
                                <input className="form-input" value={formData.field} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Job Sectors</label>
                                <div className="tag-container">
                                    {formData.sectors.map(s => <span key={s} className="form-tag">{s} <X size={14} /></span>)}
                                    <button className="add-tag-btn"><Plus size={14} /></button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Industry</label>
                                <input className="form-input" value={formData.industry} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Salary Range</label>
                                <input className="form-input" value={formData.salaryRange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Salary Type</label>
                                <select className="form-select">
                                    <option>{formData.salaryType}</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Company Name/Organization</label>
                                <input className="form-input" value={formData.companyName} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Deadline</label>
                                <input type="date" className="form-input" value={formData.deadline} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Job Type</label>
                                <select className="form-select">
                                    <option>{formData.jobType}</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Job Location</label>
                                <input className="form-input" value={formData.location} />
                            </div>
                            <div className="form-group full-width">
                                <label className="form-label">About Company</label>
                                <textarea className="form-textarea" rows="4" value={formData.aboutCompany}></textarea>
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="step-content"
                    >
                        <div className="form-title-row">
                            <h2 className="form-section-title"><FileText size={20} /> Job Description</h2>
                            <button className="overview-btn"><Eye size={16} /> Overview</button>
                        </div>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label className="form-label">Job Overview</label>
                                <textarea className="form-textarea" placeholder="Briefly describe the role, team, and main purpose..."></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Key Responsibilities</label>
                                <div className="tag-container">
                                    {formData.responsibilities.map(r => <span key={r} className="form-tag">{r} <X size={14} /></span>)}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Key Requirements</label>
                                <div className="tag-container">
                                    {formData.requirements.map(r => <span key={r} className="form-tag">{r} <X size={14} /></span>)}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Experience Level</label>
                                <select className="form-select">
                                    <option>{formData.experienceLevel}</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Work Mode</label>
                                <select className="form-select">
                                    <option>{formData.workMode}</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Employment Benefits</label>
                                <div className="tag-container">
                                    {formData.benefits.map(b => <span key={b} className="form-tag">{b} <X size={14} /></span>)}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Growth & Learning Opportunities</label>
                                <textarea className="form-textarea" placeholder="Describe career growth..."></textarea>
                            </div>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="step-content"
                    >
                        <div className="form-title-row">
                            <h2 className="form-section-title"><UserCheck size={20} /> Ideal candidate info</h2>
                            <button className="overview-btn"><Eye size={16} /> Overview</button>
                        </div>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label className="form-label">Ideal Candidate Summary</label>
                                <textarea className="form-textarea" value={formData.candidateSummary}></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Core Skills & Competencies</label>
                                <div className="tag-container">
                                    {formData.idealSkills.map(s => <span key={s} className="form-tag">{s} <X size={14} /></span>)}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Behavioral Traits</label>
                                <div className="tag-container">
                                    {formData.traits.map(t => <span key={t} className="form-tag">{t} <X size={14} /></span>)}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Educational Background</label>
                                <div className="tag-container">
                                    {formData.education.map(e => <span key={e} className="form-tag">{e} <X size={14} /></span>)}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Communication Skills</label>
                                <div className="tag-container">
                                    {['Basic', 'Good', 'Excellent'].map(lv => (
                                        <span key={lv} className={`form-tag ${formData.communication === lv ? 'active-tag' : ''}`}>{lv}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Availability / Joining Time</label>
                                <select className="form-select">
                                    <option>{formData.availability}</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="form-card">
            <div className="step-indicator">
                {steps.map((s, idx) => (
                    <div key={s.id} className={`step-item ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
                        <div className="step-dot"></div>
                        <span>{s.label}</span>
                    </div>
                ))}
            </div>

            <div className="form-body">
                {renderStep()}
            </div>

            <div className="form-actions">
                {step > 1 && <button onClick={prevStep} className="btn-secondary">Back</button>}
                <button
                    onClick={step === 3 ? () => alert('Job Updated!') : nextStep}
                    className="btn-save"
                >
                    {step === 3 ? 'Update' : 'Save & Continue'}
                </button>
            </div>
        </div>
    );
};

export default MultiStepJobForm;
