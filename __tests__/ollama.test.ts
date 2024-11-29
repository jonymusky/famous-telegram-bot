import { OllamaService } from '../src/services/ollama';

describe('OllamaService', () => {
    let ollamaService: OllamaService;
    const mockPersonality = {
        name: "Test Person",
        description: "A test personality",
        traits: ["test"],
        background: "Test background",
        systemPrompt: {
            en: "You are a test personality",
            es: "Eres una personalidad de prueba"
        }
    };

    beforeEach(() => {
        ollamaService = new OllamaService('http://localhost:11434', 'llama2');
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should make correct API call to Ollama', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ response: 'Test response' })
        });

        const response = await ollamaService.generateResponse(mockPersonality, 'Hello', 'en');

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:11434/api/generate',
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: expect.any(String)
            })
        );

        const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
        expect(body).toEqual({
            model: 'llama2',
            prompt: expect.stringContaining('Hello'),
            stream: false
        });

        expect(response).toBe('Test response');
    });

    it('should handle API errors gracefully', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        const response = await ollamaService.generateResponse(mockPersonality, 'Hello', 'en');
        expect(response).toBe('I apologize, but I am experiencing technical difficulties.');
    });
});