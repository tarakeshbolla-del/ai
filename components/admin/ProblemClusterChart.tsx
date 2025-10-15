// FIX: Removed unused imports from 'recharts' and 'useTheme'. 'Sunburst' is not an exported member of 'recharts', and the theme was not being used.
import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';

const ProblemClusterChart: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getProblemClusterData().then(chartData => {
            setData(chartData);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading cluster data...</div>;
    if (!data) return <div>Could not load cluster data.</div>;

    // This is a simplified representation as Recharts Sunburst is not in the standard build.
    // We will render a textual representation of the hierarchy.
    return (
        <div className="h-64 overflow-y-auto p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
            <ul>
                {data.children.map((parent: any, pIndex: number) => (
                    <li key={pIndex} className="mb-2">
                        <span className="font-bold text-light-accent dark:text-dark-accent">{parent.name}</span>
                        <ul className="pl-4 mt-1">
                            {parent.children.map((child: any, cIndex: number) => (
                                <li key={cIndex} className="text-sm flex justify-between">
                                    <span>- {child.name}</span>
                                    <span className="text-gray-500 dark:text-gray-400">{child.size} tickets</span>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProblemClusterChart;