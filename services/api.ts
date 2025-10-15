
import { AnalysisResult, SimilarIssue, EdaReport, TrainingStatus } from '../types';
import { generateAiSuggestion, getSimilarIssues } from './geminiService';

let trainingStatus: TrainingStatus = 'idle';
let trainingProgress = 0;

// --- MOCK API FUNCTIONS ---

export const fetchLiveSimilarIssues = async (query: string): Promise<SimilarIssue[]> => {
  console.log(`Fetching live similar issues for query: "${query}"`);
  await new Promise(resolve => setTimeout(resolve, 300));
  if (!query || query.length < 10) return [];
  return getSimilarIssues(query).slice(0, 3).map(issue => ({...issue, similarity_score: Math.random() * 0.1 + 0.88}));
};

export const analyzeIssue = async (
  description: string,
  image?: File,
  module?: string,
  priority?: string
): Promise<AnalysisResult> => {
  console.log('Starting full issue analysis...');
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  const aiSuggestion = await generateAiSuggestion(description, image);
  
  const result: AnalysisResult = {
    predictedModule: module || "Software Installation",
    predictedPriority: priority || "High",
    similarIssues: getSimilarIssues(description),
    aiSuggestion: aiSuggestion,
  };
  
  console.log('Analysis complete.');
  return result;
};

export const submitFeedback = async (solved: boolean): Promise<{status: string}> => {
    console.log(`User feedback received: ${solved ? 'Solved' : 'Not Solved'}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, this would trigger a WebSocket event.
    return { status: "success" };
}

export const uploadKnowledgeBase = async (file: File): Promise<EdaReport> => {
    console.log(`Uploading KB file: ${file.name}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
        fileName: file.name,
        fileSize: file.size,
        rowCount: Math.floor(Math.random() * 5000) + 1000,
        columns: [
            { name: 'ticket_no', type: 'string', missing: 0 },
            { name: 'date', type: 'datetime', missing: 5 },
            { name: 'problem_description', type: 'string', missing: 2 },
            { name: 'category', type: 'string', missing: 0 },
            { name: 'priority', type: 'string', missing: 0 },
            { name: 'solution_text', type: 'string', missing: 12 },
        ]
    };
};

export const initiateTraining = async (): Promise<{ jobId: string }> => {
    console.log("Initiating model training job...");
    trainingStatus = 'training';
    trainingProgress = 0;
    
    // Simulate training progress
    const interval = setInterval(() => {
        trainingProgress += 10;
        if (trainingProgress >= 100) {
            clearInterval(interval);
            trainingStatus = 'complete';
        }
    }, 1000);

    await new Promise(resolve => setTimeout(resolve, 300));
    return { jobId: `job_${Date.now()}` };
};


export const getTrainingStatus = async (): Promise<{ status: TrainingStatus }> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { status: trainingStatus };
};

// MOCK DATA FOR ADMIN DASHBOARD
export const getDashboardKpis = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        { name: "Ticket Deflection Rate", value: "34%", change: "+2.1%", isPositive: true },
        { name: "Avg. Time to Resolution", value: "4.2h", change: "-0.5h", isPositive: true },
        { name: "First Contact Resolution", value: "78%", change: "+1.5%", isPositive: true },
    ];
};

export const getRootCauseData = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        { name: 'Login & Auth', value: 400 },
        { name: 'VPN Access', value: 300 },
        { name: 'Software Install', value: 200 },
        { name: 'Network', value: 150 },
        { name: 'Hardware', value: 100 },
        { name: 'Email', value: 50 },
    ];
};

export const getHeatmapData = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Structure: { priority, category, value }
    return [
      { priority: 'Critical', category: 'Login & Auth', value: 95 },
      { priority: 'High', category: 'Login & Auth', value: 80 },
      { priority: 'Medium', category: 'Login & Auth', value: 40 },
      { priority: 'Low', category: 'Login & Auth', value: 10 },
      { priority: 'Critical', category: 'VPN Access', value: 75 },
      { priority: 'High', category: 'VPN Access', value: 85 },
      { priority: 'Medium', category: 'VPN Access', value: 30 },
      { priority: 'Low', category: 'VPN Access', value: 5 },
      // ... and so on for other categories
    ];
};

export const getProblemClusterData = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
        name: 'Problem Clusters',
        children: [
            {
                name: 'Login Issues',
                children: [
                    { name: 'Password Reset', size: 40 },
                    { name: 'MFA Failure', size: 30 },
                    { name: 'Account Lockout', size: 25 },
                ],
            },
            {
                name: 'VPN Connectivity',
                children: [
                    { name: 'Connection Drops', size: 35 },
                    { name: 'Slow Performance', size: 20 },
                    { name: 'Client Error', size: 15 },
                ],
            },
        ],
    };
};

export const getSentimentTrendData = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        data: [0.3, 0.2, 0.25, 0.1, 0.15, 0.12] // Lower is better (less frustration)
    };
};
