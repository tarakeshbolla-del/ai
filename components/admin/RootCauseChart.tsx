
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import * as api from '../../services/api';
import { useTheme } from '../../hooks/useTheme';

interface RootCauseChartProps {
    onCategorySelect: (category: string) => void;
}

const RootCauseChart: React.FC<RootCauseChartProps> = ({ onCategorySelect }) => {
    const [data, setData] = useState<any[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const { theme } = useTheme();

    useEffect(() => {
        api.getRootCauseData().then(setData);
    }, []);

    useEffect(() => {
        if(data.length > 0) {
            onCategorySelect(data[0].name);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const handleClick = (data: any, index: number) => {
        setActiveIndex(index);
        onCategorySelect(data.name);
    };
    
    const colors = {
        light: {
            grid: '#e0e0e0',
            text: '#2C3E50',
            bar: '#8884d8',
            activeBar: '#0EA5E9',
        },
        dark: {
            grid: '#334155',
            text: '#E2E8F0',
            bar: '#8884d8',
            activeBar: '#22D3EE',
        }
    }
    const themeColors = colors[theme];


    if (!data.length) return <div>Loading chart...</div>;

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} />
                    <XAxis dataKey="name" tick={{ fill: themeColors.text, fontSize: 12 }} />
                    <YAxis tick={{ fill: themeColors.text, fontSize: 12 }} />
                    <Tooltip 
                      cursor={{fill: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}}
                      contentStyle={{ backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF', border: `1px solid ${themeColors.grid}`}}
                    />
                    <Bar dataKey="value" name="Tickets" onClick={handleClick}>
                        {data.map((entry, index) => (
                            <Cell cursor="pointer" fill={index === activeIndex ? themeColors.activeBar : themeColors.bar} key={`cell-${index}`} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RootCauseChart;
