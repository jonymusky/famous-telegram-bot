import { personalities } from '../src/types/personality';

describe('Personalities', () => {
    it('should have Einstein personality configured correctly', () => {
        const einstein = personalities.einstein;
        
        expect(einstein).toBeDefined();
        expect(einstein.name).toBe('Albert Einstein');
        expect(einstein.traits).toContain('genius');
        expect(einstein.systemPrompt.en).toContain('Einstein');
        expect(einstein.systemPrompt.es).toContain('Einstein');
    });

    it('should have Shakespeare personality configured correctly', () => {
        const shakespeare = personalities.shakespeare;
        
        expect(shakespeare).toBeDefined();
        expect(shakespeare.name).toBe('William Shakespeare');
        expect(shakespeare.traits).toContain('poetic');
        expect(shakespeare.systemPrompt.en).toContain('Shakespeare');
        expect(shakespeare.systemPrompt.es).toContain('Shakespeare');
    });

    it('should have required fields for all personalities', () => {
        const requiredFields = ['name', 'description', 'traits', 'background', 'systemPrompt'];
        
        Object.values(personalities).forEach(personality => {
            requiredFields.forEach(field => {
                expect(personality[field]).toBeDefined();
                expect(personality[field]).not.toBe('');
            });
            
            expect(Array.isArray(personality.traits)).toBe(true);
            expect(personality.traits.length).toBeGreaterThan(0);
            expect(personality.systemPrompt).toHaveProperty('en');
            expect(personality.systemPrompt).toHaveProperty('es');
        });
    });
});