
import React, { useEffect, useState } from 'react';

interface WordCloudProps {
    category: string | null;
}

// Simple deterministic "hash" function to generate pseudo-random sizes and colors
const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

const WordCloud: React.FC<WordCloudProps> = ({ category }) => {
    const [words, setWords] = useState<{ text: string, size: number }[]>([]);

    useEffect(() => {
        if (!category) {
            setWords([]);
            return;
        }

        // Mock word generation based on category
        let baseWords: string[] = [];
        const catLower = category.toLowerCase();

        if (catLower.includes('login')) {
            baseWords = ['password', 'reset', 'MFA', 'locked', 'credentials', 'username', 'expired', 'account'];
        } else if (catLower.includes('vpn')) {
            baseWords = ['connect', 'VPN', 'slow', 'disconnect', 'error', 'client', 'server', 'firewall'];
        } else if (catLower.includes('software')) {
            baseWords = ['install', 'update', 'error', 'license', 'crash', 'Adobe', 'Office', 'plugin'];
        } else {
            baseWords = ['issue', 'error', 'network', 'slow', 'not working', 'screen', 'keyboard', 'mouse'];
        }

        const generatedWords = baseWords.map(word => ({
            text: word,
            size: 1 + (simpleHash(word + category) % 5), // Size from 1 to 5
        })).sort(() => simpleHash(category) % 2 - 0.5); // pseudo-random sort

        setWords(generatedWords);
    }, [category]);

    if (!category) {
        return <div className="flex items-center justify-center h-full text-gray-400">Select a category to see a word cloud.</div>;
    }

    const sizes = ['text-sm', 'text-md', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'];
    const colors = ['text-sky-500', 'text-cyan-500', 'text-indigo-500', 'text-blue-500', 'text-purple-500'];

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 h-full">
            {words.map((word) => (
                <span 
                    key={word.text} 
                    className={`${sizes[word.size]} font-bold ${colors[simpleHash(word.text) % colors.length]}`}
                >
                    {word.text}
                </span>
            ))}
        </div>
    );
};

export default WordCloud;
