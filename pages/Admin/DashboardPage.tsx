
import React, { useState, useEffect } from 'react';
import { Kpi } from '../../types';
import * as api from '../../services/api';

import KpiCard from '../../components/admin/KpiCard';
import RootCauseChart from '../../components/admin/RootCauseChart';
import WordCloud from '../../components/admin/WordCloud';
import ImpactHeatmap from '../../components/admin/ImpactHeatmap';


const DashboardPage: React.FC = () => {
    const [kpis, setKpis] = useState<Kpi[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        api.getDashboardKpis().then(setKpis);
        // Simulate real-time updates for KPIs
        const interval = setInterval(() => {
            setKpis(prevKpis => prevKpis.map(kpi => {
                if (kpi.name === "Ticket Deflection Rate") {
                   const newValue = parseFloat(kpi.value) + 0.1;
                   return {...kpi, value: `${newValue.toFixed(1)}%`}
                }
                return kpi;
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">Dashboard</h1>
            
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kpis.map(kpi => (
                    <KpiCard key={kpi.name} kpi={kpi} />
                ))}
            </div>

            {/* Root Cause Funnel & Word Cloud */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border">
                    <h2 className="text-xl font-semibold mb-4">Top Root Causes (Pareto)</h2>
                    <RootCauseChart onCategorySelect={handleCategorySelect} />
                </div>
                <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border">
                    <h2 className="text-xl font-semibold mb-4">Problem Word Cloud</h2>
                    <WordCloud category={selectedCategory} />
                </div>
            </div>

            {/* Business Impact Heatmap */}
            <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border">
                <h2 className="text-xl font-semibold mb-4">Business Impact Heatmap</h2>
                <ImpactHeatmap />
            </div>

        </div>
    );
};

export default DashboardPage;
