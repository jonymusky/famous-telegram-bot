import { AIConfig, AIProvider } from './ai-provider.interface';
import { OpenAIService } from './openai';
import { OllamaService } from './ollama';

export class AIFactory {
    static createProvider(config: AIConfig): AIProvider {
        switch (config.provider) {
            case 'openai':
                if (!config.openAIConfig?.apiKey) {
                    throw new Error('OpenAI API key is required');
                }
                return new OpenAIService(config.openAIConfig.apiKey);
            
            case 'ollama':
                if (!config.ollamaConfig?.baseUrl || !config.ollamaConfig?.model) {
                    throw new Error('Ollama base URL and model are required');
                }
                return new OllamaService(config.ollamaConfig.baseUrl, config.ollamaConfig.model);
            
            default:
                throw new Error(`Unknown AI provider: ${config.provider}`);
        }
    }
}