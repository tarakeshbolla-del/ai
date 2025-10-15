
import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import { MODULE_CATEGORIES, PRIORITIES } from '../../constants';

interface HeatmapDataPoint {
    priority: string;
    category: string;
    value: number;
}

const ImpactHeatmap: React.FC = () => {
    const [data, setData] = useState<HeatmapDataPoint[]>([]);

    useEffect(() => {
        api.getHeatmapData().then(setData);

        // Simulate real-time updates
        const interval = setInterval(() => {
            setData(prevData => {
                const newData = [...prevData];
                const randomIndex = Math.floor(Math.random() * newData.length);
                if (newData[randomIndex]) {
                    newData[randomIndex] = { ...newData[randomIndex], value: Math.min(100, newData[randomIndex].value + 1) };
                }
                return newData;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const getColor = (value: number) => {
        if (value > 90) return 'bg-red-700';
        if (value > 75) return 'bg-red-600';
        if (value > 60) return 'bg-orange-500';
        if (value > 40) return 'bg-yellow-500';
        if (value > 20) return 'bg-yellow-400';
        return 'bg-green-500';
    };

    const findValue = (category: string, priority: string): number => {
        const point = data.find(d => d.category === category && d.priority === priority);
        return point ? point.value : 0;
    };

    const yAxisLabels = [...PRIORITIES].reverse(); // Critical on top
    const xAxisLabels = MODULE_CATEGORIES.slice(0, 6); // Limit for display

    return (
        <div className="flex">
            <div className="flex flex-col justify-between text-xs text-right pr-2">
                {yAxisLabels.map(p => <div key={p} className="h-10 flex items-center">{p}</div>)}
            </div>
            <div className="flex-1">
                <div className="grid grid-cols-6 gap-1">
                    {yAxisLabels.map(priority => 
                        xAxisLabels.map(category => {
                            const value = findValue(category, priority);
                            return (
                                <div key={`${category}-${priority}`} title={`${category} - ${priority}: ${value}`} className={`h-10 rounded ${getColor(value)} transition-colors`}></div>
                            );
                        })
                    )}
                </div>
                <div className="grid grid-cols-6 text-xs mt-2">
                    {xAxisLabels.map(c => <div key={c} className="text-center truncate" title={c}>{c}</div>)}
                </div>
            </div>
        </div>
    );
};

export default ImpactHeatmap;
