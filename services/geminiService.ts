
import { GoogleGenAI } from "@google/genai";
import type { SimilarIssue } from '../types';

// This is a mock implementation. In a real app, you would not expose the API key on the client.
// It is assumed `process.env.API_KEY` is available in the execution environment.
const API_KEY = process.env.API_KEY || "mock-api-key";

// We won't actually instantiate GoogleGenAI here to avoid network requests in this example.
// We will just mock the functions that would use it.
// const ai = new GoogleGenAI({ apiKey: API_KEY });

const MOCK_DB: SimilarIssue[] = [
    { ticket_no: 'T001', problem_description: 'Cannot reset my login password.', solution_text: 'Go to reset.company.com and follow the prompts.', similarity_score: 0 },
    { ticket_no: 'T002', problem_description: 'My VPN password expired and I cannot connect.', solution_text: 'Your VPN password is the same as your network password. Please reset it first.', similarity_score: 0 },
    { ticket_no: 'T003', problem_description: 'Screen is flickering after Windows update.', solution_text: 'Roll back the graphics driver via Device Manager.', similarity_score: 0 },
    { ticket_no: 'T004', problem_description: 'Unable to login to my account, getting invalid credentials error.', solution_text: 'Please try resetting your password at reset.company.com. If the issue persists, contact support.', similarity_score: 0 },
    { ticket_no: 'T005', problem_description: 'I need to install Adobe Photoshop.', solution_text: 'Go to the Software Center application and search for Adobe Photoshop to install.', similarity_score: 0 },
];

export const generateAiSuggestion = async (description: string, image?: File): Promise<string> => {
    // This function simulates calling `ai.models.generateContent`
    console.log("Simulating Gemini API call for suggestion...");
    
    let prompt = `Analyze the following IT issue and provide a step-by-step solution for the end-user. The issue is: "${description}".`;
    if (image) {
        prompt += `\nAn image has been provided for context.`;
    }

    // In a real implementation:
    /*
    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
    });
    return response.text;
    */

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (description.toLowerCase().includes('password')) {
        return `
### Recommended Solution: Password Reset

It seems like you're having trouble with a password. Here are the recommended steps:

1.  **Navigate to the Self-Service Portal**: Open your web browser and go to \`https://reset.company.com\`.
2.  **Enter Your Username**: Type in your company email address (e.g., \`user@company.com\`).
3.  **Follow On-Screen Instructions**: The system will guide you through the process of verifying your identity and setting a new password.
4.  **Test New Password**: Once reset, try logging into a service like your email to confirm it's working.

If you are trying to reset your **VPN password**, please note it is the same as your main network password.
`;
    }

    return `
### AI-Generated Suggestion

Based on your description, here are some steps you can take:

1.  **Restart Your Computer**: This is often the quickest way to resolve temporary software glitches.
2.  **Check Your Connections**: Ensure all cables (power, monitor, network) are securely plugged in.
3.  **Consult the Knowledge Base**: Search for keywords related to your issue on the company's internal wiki.
4.  **Re-install the Application**: If the issue is with a specific program, try uninstalling and then reinstalling it from the Software Center.
`;
};

export const getSimilarIssues = (query: string): SimilarIssue[] => {
    // This simulates the two-stage retrieval and re-ranking pipeline.
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('password')) {
        return [ MOCK_DB[0], MOCK_DB[1], MOCK_DB[3] ].map(issue => ({...issue, similarity_score: Math.random() * 0.15 + 0.85}));
    }
    if (lowerQuery.includes('install')) {
        return [ MOCK_DB[4] ].map(issue => ({...issue, similarity_score: Math.random() * 0.1 + 0.9}));
    }
    if (lowerQuery.includes('screen') || lowerQuery.includes('flicker')) {
        return [ MOCK_DB[2] ].map(issue => ({...issue, similarity_score: Math.random() * 0.1 + 0.9}));
    }
    
    return MOCK_DB.slice(0,4).sort(() => 0.5 - Math.random()).map(issue => ({...issue, similarity_score: Math.random() * 0.2 + 0.75}));
};
