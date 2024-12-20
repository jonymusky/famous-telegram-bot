import { Bot, Context, session, SessionFlavor } from 'grammy';
import dotenv from 'dotenv';
import { personalities } from './types/personality';
import { AIFactory } from './services/ai-factory';
import { AIConfig, AIProvider } from './services/ai-provider.interface';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

// Define session interface
interface SessionData {
    currentPersonality: string | undefined;
    language: 'en' | 'es';
}

interface MyContext extends Context {
    session: SessionData;
}

// Configure AI provider
const aiConfig: AIConfig = {
    provider: (process.env.AI_PROVIDER as 'openai' | 'ollama' | 'gemini') || 'openai',
    openAIConfig: {
        apiKey: process.env.OPENAI_API_KEY,
    },
    ollamaConfig: {
        baseUrl: process.env.OLLAMA_BASE_URL,
        model: process.env.OLLAMA_MODEL,
    },
    geminiConfig: {
        apiKey: process.env.GEMINI_API_KEY,
        model: process.env.GEMINI_MODEL,
    }
};

// Initialize bot and services
const bot = new Bot<MyContext>(process.env.TELEGRAM_BOT_TOKEN || '');
const aiProvider: AIProvider = AIFactory.createProvider(aiConfig);

// Set up session
bot.use(session({
    initial: (): SessionData => ({
        currentPersonality: undefined,
        language: 'en'
    }),
}));

// Language command
bot.command('lang', async (ctx) => {
    const lang = ctx.message?.text.split(' ')[1]?.toLowerCase();
    if (lang === 'en' || lang === 'es') {
        ctx.session.language = lang;
        const message = lang === 'en' 
            ? "Language set to English" 
            : "Idioma configurado a Español";
        logger.info('Language changed', { 
            userId: ctx.from?.id,
            language: lang 
        });
        await ctx.reply(message);
    } else {
        const message = ctx.session.language === 'en'
            ? "Please specify a language (en/es). Example: /lang en"
            : "Por favor especifica un idioma (en/es). Ejemplo: /lang es";
        await ctx.reply(message);
    }
});

// Command to show current configuration
bot.command('config', async (ctx) => {
    logger.info('Config requested', { userId: ctx.from?.id });
    const config = ctx.session.language === 'en'
        ? `Current Configuration:
- AI Provider: ${aiConfig.provider}
- Language: ${ctx.session.language}
${aiConfig.provider === 'ollama' ? `- Model: ${aiConfig.ollamaConfig?.model}` : ''}`
        : `Configuración Actual:
- Proveedor AI: ${aiConfig.provider}
- Idioma: ${ctx.session.language}
${aiConfig.provider === 'ollama' ? `- Modelo: ${aiConfig.ollamaConfig?.model}` : ''}`;
    
    await ctx.reply(config);
});

// Command to list available personalities
bot.command('personalities', async (ctx) => {
    logger.info('Personalities list requested', { userId: ctx.from?.id });
    const personalityList = Object.entries(personalities)
        .map(([key, p]) => `/${key} - ${p.name}: ${p.description}`)
        .join('\n');
    
    const message = ctx.session.language === 'en'
        ? 'Available personalities:\n'
        : 'Personalidades disponibles:\n';
    
    await ctx.reply(message + personalityList);
});

// Commands to select personality
Object.keys(personalities).forEach(personalityKey => {
    bot.command(personalityKey, async (ctx) => {
        ctx.session.currentPersonality = personalityKey;
        const personality = personalities[personalityKey];
        logger.info('Personality selected', { 
            userId: ctx.from?.id,
            personality: personalityKey 
        });
        const message = ctx.session.language === 'en'
            ? `Now talking as ${personality.name}! Feel free to start the conversation.`
            : `¡Ahora hablando como ${personality.name}! Puedes comenzar la conversación.`;
        await ctx.reply(message);
    });
});

// Handle messages
bot.on('message:text', async (ctx) => {
    if (!ctx.session.currentPersonality) {
        const message = ctx.session.language === 'en'
            ? "Please select a personality first using one of these commands:\n"
            : "Por favor selecciona una personalidad usando uno de estos comandos:\n";
        
        await ctx.reply(
            message +
            Object.keys(personalities).map(key => `/${key}`).join(', ')
        );
        return;
    }

    const personality = personalities[ctx.session.currentPersonality];
    logger.info('Processing message', { 
        userId: ctx.from?.id,
        personality: ctx.session.currentPersonality,
        messageLength: ctx.message?.text.length 
    });

    const response = await aiProvider.generateResponse(
        personality,
        ctx.message.text,
        ctx.session.language
    );

    logger.info('Response generated', { 
        userId: ctx.from?.id,
        personality: ctx.session.currentPersonality,
        responseLength: response.length 
    });

    await ctx.reply(response);
});

// Error handling
bot.catch((err) => {
    logger.error('Bot error', { error: err });
});

// Start the bot
bot.start();
logger.info(`Bot is running with ${aiConfig.provider} provider...`);