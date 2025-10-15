
import React from 'react';

const SettingsPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">Settings</h1>
            <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border">
                <h2 className="text-xl font-semibold mb-4">Application Settings</h2>
                <p className="text-gray-500 dark:text-gray-400">Configuration options will be available here in a future version.</p>
            </div>
        </div>
    );
};

export default SettingsPage;
