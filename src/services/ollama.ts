import { Personality } from '../types/personality';
import { AIProvider } from './ai-provider.interface';

export class OllamaService implements AIProvider {
    constructor(
        private baseUrl: string,
        private model: string
    ) {}

    async generateResponse(personality: Personality, userMessage: string, language: 'en' | 'es' = 'en'): Promise<string> {
        try {
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.model,
                    prompt: `${personality.systemPrompt[language]}\n\nUser: ${userMessage}\nAssistant:`,
                    stream: false,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.response || "I apologize, but I am unable to respond at the moment.";
        } catch (error) {
            console.error('Error generating AI response:', error);
            return "I apologize, but I am experiencing technical difficulties.";
        }
    }
}