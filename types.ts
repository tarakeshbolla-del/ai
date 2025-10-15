
export interface SimilarIssue {
  ticket_no: string;
  problem_description: string;
  solution_text: string;
  similarity_score: number;
}

export interface AnalysisResult {
  predictedModule: string;
  predictedPriority: string;
  similarIssues: SimilarIssue[];
  aiSuggestion: string;
}

export interface Kpi {
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export type TrainingStatus = 'idle' | 'training' | 'complete' | 'failed';

export interface EdaReport {
    fileName: string;
    fileSize: number;
    rowCount: number;
    columns: { name: string, type: string, missing: number }[];
}
