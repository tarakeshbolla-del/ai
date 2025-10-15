
import React from 'react';
import ProblemClusterChart from '../../components/admin/ProblemClusterChart';
import SentimentTrendChart from '../../components/admin/SentimentTrendChart';

const AnalyticsPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">Analytics & Reporting</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Predictive Reports */}
                <div className="space-y-6">
                    <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border">
                        <h2 className="text-xl font-semibold mb-4">Predictive: Ticket Volume Forecasting</h2>
                        <p className="text-gray-500 dark:text-gray-400">Forecasting chart would be here...</p>
                    </div>
                    <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border">
                        <h2 className="text-xl font-semibold mb-4">Predictive: Hotspots (At-Risk Apps)</h2>
                        <p className="text-gray-500 dark:text-gray-400">Hotspot visualization would be here...</p>
                    </div>
                </div>

                {/* Diagnostic Reports */}
                <div className="space-y-6">
                    <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border">
                        <h2 className="text-xl font-semibold mb-4">Diagnostic: AI-Powered Problem Clusters</h2>
                        <ProblemClusterChart />
                    </div>
                     <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border">
                        <h2 className="text-xl font-semibold mb-4">Diagnostic: User Frustration Index</h2>
                        <SentimentTrendChart />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
