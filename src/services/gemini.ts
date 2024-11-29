import { GoogleGenerativeAI } from '@google/generative-ai';
import { Personality } from '../types/personality';
import { AIProvider } from './ai-provider.interface';

export class GeminiService implements AIProvider {
    private genAI: GoogleGenerativeAI;
    private model: string;

    constructor(apiKey: string, model = 'gemini-pro') {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = model;
    }

    async generateResponse(personality: Personality, userMessage: string, language: 'en' | 'es'): Promise<string> {
        try {
            const model = this.genAI.getGenerativeModel({ model: this.model });
            const prompt = `${personality.systemPrompt[language]}\n\nUser: ${userMessage}\nAssistant:`;
            
            const result = await model.generateContent(prompt);
            const response = result.response;
            return response.text() || "I apologize, but I am unable to respond at the moment.";
        } catch (error) {
            console.error('Error generating AI response:', error);
            return "I apologize, but I am experiencing technical difficulties.";
        }
    }
}