
import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import Header from '../../components/Header';
import Loader from '../../components/Loader';
import { MODULE_CATEGORIES, PRIORITIES } from '../../constants';
import { AnalysisResult, SimilarIssue } from '../../types';
import { fetchLiveSimilarIssues, analyzeIssue, submitFeedback } from '../../services/api';

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

const HomePage: React.FC = () => {
    const [description, setDescription] = useState('');
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [module, setModule] = useState('');
    const [priority, setPriority] = useState('');
    const [liveIssues, setLiveIssues] = useState<SimilarIssue[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setScreenshot(e.target.files[0]);
        }
    };
    
    // Debounce for live search
    useEffect(() => {
        if (description.trim().split(/\s+/).length < 10) {
            setLiveIssues([]);
            return;
        }

        const handler = setTimeout(() => {
            fetchLiveSimilarIssues(description).then(setLiveIssues);
        }, 500);

        return () => clearTimeout(handler);
    }, [description]);

    const handleAnalyze = async () => {
        if (!description && !screenshot) {
            alert("Please provide a description or a screenshot.");
            return;
        }
        setIsLoading(true);
        setAnalysisResult(null);
        try {
            const result = await analyzeIssue(description, screenshot || undefined, module, priority);
            setAnalysisResult(result);
        } catch (error) {
            console.error("Analysis failed:", error);
            alert("An error occurred during analysis.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFeedback = async (solved: boolean) => {
        setFeedbackSubmitted(solved ? 'Thank you! We are glad we could help.' : 'Thank you for your feedback. A support ticket has been created.');
        await submitFeedback(solved);
        setTimeout(() => {
            // Reset state and "redirect"
            setDescription('');
            setScreenshot(null);
            setModule('');
            setPriority('');
            setLiveIssues([]);
            setAnalysisResult(null);
            setFeedbackSubmitted(null);
            window.scrollTo(0, 0);
        }, 3500);
    };

    const renderSubmissionForm = () => (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-light-text dark:text-dark-text">Describe Your Issue</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Get instant AI-powered solutions and help us improve our services.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border">
                    <label htmlFor="description" className="block text-lg font-semibold text-light-text dark:text-dark-text mb-2">Problem Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full h-48 p-3 bg-slate-100 dark:bg-slate-700 border border-light-border dark:border-dark-border rounded-md focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition text-light-text dark:text-dark-text"
                        placeholder="Please provide a detailed description of the issue you are facing..."
                    />
                </div>
                 <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border flex flex-col items-center justify-center">
                    <label htmlFor="screenshot-upload" className="cursor-pointer text-center">
                        <UploadIcon />
                        <p className="text-lg font-semibold text-light-text dark:text-dark-text mt-2">Upload Screenshot</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Drag & drop or click to upload</p>
                        {screenshot && <p className="text-green-500 mt-2 text-sm">{screenshot.name}</p>}
                    </label>
                    <input id="screenshot-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </div>
            </div>

            {liveIssues.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Similar Solved Issues:</h3>
                    <ul className="mt-2 space-y-2">
                        {liveIssues.map(issue => (
                            <li key={issue.ticket_no} className="p-3 bg-light-card dark:bg-dark-card rounded-md border border-light-border dark:border-dark-border text-sm">
                                <p className="font-bold text-light-accent dark:text-dark-accent">{issue.ticket_no}</p>
                                <p className="text-light-text dark:text-dark-text truncate">{issue.problem_description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-6 bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border">
                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">User-Guided Triage (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="module" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Module / Category</label>
                        <select id="module" value={module} onChange={(e) => setModule(e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 border border-light-border dark:border-dark-border rounded-md focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition text-light-text dark:text-dark-text">
                            <option value="">Let AI Predict</option>
                            {MODULE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Priority</label>
                        <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 border border-light-border dark:border-dark-border rounded-md focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition text-light-text dark:text-dark-text">
                            <option value="">Let AI Predict</option>
                            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="text-center mt-8">
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading || (!description && !screenshot)}
                    className="bg-light-accent dark:bg-dark-accent text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                    {isLoading ? <div className="flex items-center"><Loader /> <span className="ml-2">Analyzing...</span></div> : 'Analyze Issue'}
                </button>
            </div>
            
            <div className="text-center mt-4">
                 <Link to="/admin" className="text-sm text-gray-500 dark:text-gray-400 hover:underline">Admin Login</Link>
            </div>
        </div>
    );
    
    const renderAnalysisResult = () => (
        <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-light-text dark:text-dark-text mb-6">Analysis & Solution</h2>

            {feedbackSubmitted ? (
                 <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-md" role="alert">
                    <p className="font-bold">Feedback Received</p>
                    <p>{feedbackSubmitted}</p>
                </div>
            ) : (
                <>
                    <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border mb-6">
                        <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">AI Analysis</h3>
                        <div className="flex space-x-8">
                            <p><strong>Predicted Module:</strong> <span className="bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 px-2 py-1 rounded">{analysisResult!.predictedModule}</span></p>
                            <p><strong>Predicted Priority:</strong> <span className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-1 rounded">{analysisResult!.predictedPriority}</span></p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">✅ Previously Solved Similar Issues</h3>
                        <div className="space-y-3">
                            {analysisResult!.similarIssues.map(issue => (
                                <details key={issue.ticket_no} className="bg-light-card dark:bg-dark-card p-4 rounded-lg border border-light-border dark:border-dark-border cursor-pointer">
                                    <summary className="font-semibold text-light-accent dark:text-dark-accent list-none flex justify-between items-center">
                                        <span>{issue.ticket_no}: {issue.problem_description}</span>
                                        <span className="text-xs font-mono text-gray-400">Score: {issue.similarity_score.toFixed(2)}</span>
                                    </summary>
                                    <div className="prose prose-sm dark:prose-invert mt-2 pt-2 border-t border-light-border dark:border-dark-border">
                                        <p>{issue.solution_text}</p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">🤖 AI-Generated Suggestion</h3>
                        <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border">
                            <div className="prose dark:prose-invert max-w-none text-light-text dark:text-dark-text">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysisResult!.aiSuggestion}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-center p-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <p className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">Did this solve your problem?</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => handleFeedback(true)} className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition">👍 Yes, this solved it!</button>
                            <button onClick={() => handleFeedback(false)} className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition">👎 This didn't help, create ticket.</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
    
    return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors">
            <Header />
            <main>
                {isLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
                        <Loader />
                        <p className="text-white text-lg mt-4">Analyzing your issue...</p>
                    </div>
                )}
                {analysisResult ? renderAnalysisResult() : renderSubmissionForm()}
            </main>
        </div>
    );
};

export default HomePage;
