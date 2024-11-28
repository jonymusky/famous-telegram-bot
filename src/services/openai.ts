import OpenAI from 'openai';
import { Personality } from '../types/personality';

export class OpenAIService {
    private openai: OpenAI;

    constructor(apiKey: string) {
        this.openai = new OpenAI({
            apiKey: apiKey,
        });
    }

    async generateResponse(personality: Personality, userMessage: string, language: 'en' | 'es' = 'en'): Promise<string> {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: personality.systemPrompt[language] },
                    { role: "user", content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 150
            });

            return response.choices[0].message.content || "I apologize, but I am unable to respond at the moment.";
        } catch (error) {
            console.error('Error generating AI response:', error);
            return "I apologize, but I am experiencing technical difficulties.";
        }
    }
}