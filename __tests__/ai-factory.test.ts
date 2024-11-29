import { AIFactory } from '../src/services/ai-factory';
import { OpenAIService } from '../src/services/openai';
import { OllamaService } from '../src/services/ollama';

describe('AIFactory', () => {
    it('should create OpenAI provider when configured for OpenAI', () => {
        const config = {
            provider: 'openai' as const,
            openAIConfig: {
                apiKey: 'test-key'
            }
        };

        const provider = AIFactory.createProvider(config);
        expect(provider).toBeInstanceOf(OpenAIService);
    });

    it('should create Ollama provider when configured for Ollama', () => {
        const config = {
            provider: 'ollama' as const,
            ollamaConfig: {
                baseUrl: 'http://localhost:11434',
                model: 'llama2'
            }
        };

        const provider = AIFactory.createProvider(config);
        expect(provider).toBeInstanceOf(OllamaService);
    });

    it('should throw error when OpenAI config is missing API key', () => {
        const config = {
            provider: 'openai' as const,
            openAIConfig: {}
        };

        expect(() => AIFactory.createProvider(config)).toThrow('OpenAI API key is required');
    });

    it('should throw error when Ollama config is missing required fields', () => {
        const config = {
            provider: 'ollama' as const,
            ollamaConfig: {
                baseUrl: ''
            }
        };

        expect(() => AIFactory.createProvider(config)).toThrow('Ollama base URL and model are required');
    });
});