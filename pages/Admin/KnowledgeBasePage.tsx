
import React, { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { EdaReport, TrainingStatus } from '../../types';
import * as api from '../../services/api';
import Loader from '../../components/Loader';

const KnowledgeBasePage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [edaReport, setEdaReport] = useState<EdaReport | null>(null);
    const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>('idle');
    const [jobId, setJobId] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setEdaReport(null);
            setTrainingStatus('idle');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        try {
            const report = await api.uploadKnowledgeBase(file);
            setEdaReport(report);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("File upload failed.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleStartTraining = async () => {
        setTrainingStatus('training');
        try {
            const response = await api.initiateTraining();
            setJobId(response.jobId);
        } catch (error) {
            console.error("Training initiation failed:", error);
            alert("Failed to start training.");
            setTrainingStatus('failed');
        }
    };

    useEffect(() => {
        let interval: number;
        if (trainingStatus === 'training' && jobId) {
            interval = window.setInterval(async () => {
                const { status } = await api.getTrainingStatus();
                setTrainingStatus(status);
                if (status === 'complete' || status === 'failed') {
                    clearInterval(interval);
                }
            }, 2000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [trainingStatus, jobId]);

    const renderTrainingStatus = () => {
        switch (trainingStatus) {
            case 'training':
                return <div className="flex items-center text-yellow-500"><Loader /> <span className="ml-2">Training in progress...</span></div>;
            case 'complete':
                return <div className="text-green-500 font-bold">✅ Training Complete</div>;
            case 'failed':
                return <div className="text-red-500 font-bold">❌ Training Failed</div>;
            case 'idle':
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">Knowledge Base Management</h1>
            
            <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border">
                <h2 className="text-xl font-semibold mb-4">Upload Knowledge Base (CSV)</h2>
                <div className="flex items-center space-x-4">
                    <input type="file" accept=".csv" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-light-accent/10 file:text-light-accent dark:file:bg-dark-accent/10 dark:file:text-dark-accent hover:file:bg-light-accent/20 dark:hover:file:bg-dark-accent/20"/>
                    <button onClick={handleUpload} disabled={!file || isUploading} className="bg-light-accent dark:bg-dark-accent text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
                        {isUploading ? 'Uploading...' : 'Upload & Analyze'}
                    </button>
                </div>
            </div>

            {isUploading && <Loader />}

            {edaReport && (
                <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border animate-fade-in">
                    <h2 className="text-xl font-semibold mb-4">Exploratory Data Analysis (EDA) Report</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-center">
                       <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded"><strong>File:</strong> {edaReport.fileName}</div>
                       <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded"><strong>Size:</strong> {(edaReport.fileSize / 1024).toFixed(2)} KB</div>
                       <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded"><strong>Rows:</strong> {edaReport.rowCount}</div>
                    </div>
                     <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-light-border dark:border-dark-border">
                                <th className="p-2">Column</th>
                                <th className="p-2">Type</th>
                                <th className="p-2">Missing Values</th>
                            </tr>
                        </thead>
                        <tbody>
                            {edaReport.columns.map(col => (
                                <tr key={col.name} className="border-b border-light-border dark:border-dark-border last:border-b-0">
                                    <td className="p-2 font-mono">{col.name}</td>
                                    <td className="p-2">{col.type}</td>
                                    <td className="p-2">{col.missing}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     <div className="mt-6 text-center">
                        <button onClick={handleStartTraining} disabled={trainingStatus === 'training' || trainingStatus === 'complete'} className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 disabled:opacity-50">
                            Start Model Training
                        </button>
                        <div className="mt-4 h-6">{renderTrainingStatus()}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KnowledgeBasePage;
