import { Personality } from '../types/personality';

export interface AIProvider {
    generateResponse(personality: Personality, userMessage: string, language: 'en' | 'es'): Promise<string>;
}


export interface AIConfig {
    provider: 'openai' | 'ollama' | 'gemini';
    ollamaConfig?: {
        baseUrl?: string;
        model?: string;
    };
    openAIConfig?: {
        apiKey?: string;
    };
    geminiConfig?: {
        apiKey?: string;
        model?: string;
    };
}