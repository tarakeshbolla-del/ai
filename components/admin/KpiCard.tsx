
import React from 'react';
import { Kpi } from '../../types';

interface KpiCardProps {
    kpi: Kpi;
}

const KpiCard: React.FC<KpiCardProps> = ({ kpi }) => {
    const changeColor = kpi.isPositive ? 'text-green-500' : 'text-red-500';

    return (
        <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.name}</h3>
            <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-bold text-light-text dark:text-dark-text">{kpi.value}</p>
                <p className={`ml-2 flex items-baseline text-sm font-semibold ${changeColor}`}>
                    {kpi.isPositive ? (
                        <svg className="w-5 h-5 self-center fill-current" viewBox="0 0 20 20"><path d="M10.707 7.293a1 1 0 00-1.414 0L6 10.586 4.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z"/></svg>
                    ) : (
                        <svg className="w-5 h-5 self-center fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"/></svg>
                    )}
                    <span className="ml-1">{kpi.change}</span>
                </p>
            </div>
        </div>
    );
};

export default KpiCard;
