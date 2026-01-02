import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import MultiStepJobForm from '../components/MultiStepJobForm';

const EmployerDashboard = () => {
    return (
        <DashboardLayout title="View & Edit">
            <MultiStepJobForm />
        </DashboardLayout>
    );
};

export default EmployerDashboard;
