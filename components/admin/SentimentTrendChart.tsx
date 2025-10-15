
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import * as api from '../../services/api';

interface TrendData {
    labels: string[];
    data: number[];
}

const SentimentTrendChart: React.FC = () => {
    const [chartData, setChartData] = useState<any[]>([]);
    const { theme } = useTheme();

    useEffect(() => {
        api.getSentimentTrendData().then((data: TrendData) => {
            const formattedData = data.labels.map((label, index) => ({
                name: label,
                frustration: data.data[index]
            }));
            setChartData(formattedData);
        });
    }, []);

    if (!chartData.length) return <div>Loading trend data...</div>;

    const colors = {
        light: { grid: '#e0e0e0', text: '#2C3E50', line: '#ff7300' },
        dark: { grid: '#334155', text: '#E2E8F0', line: '#ff7300' }
    }
    const themeColors = colors[theme];
    
    return (
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} />
                    <XAxis dataKey="name" tick={{ fill: themeColors.text, fontSize: 12 }} />
                    <YAxis tick={{ fill: themeColors.text, fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF', border: `1px solid ${themeColors.grid}`}}
                    />
                    <Line type="monotone" dataKey="frustration" stroke={themeColors.line} strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SentimentTrendChart;
