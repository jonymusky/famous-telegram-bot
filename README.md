# AI Personality Telegram Bot

A Telegram bot that uses AI to impersonate famous personalities. The bot can take on different personas and respond to messages in their unique style.

## Features

- Support for multiple AI providers (OpenAI and Ollama)
- Configurable personalities
- Easy to extend with new personalities
- Session management for user conversations

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your Telegram Bot Token (get it from [@BotFather](https://t.me/BotFather))
   - Configure your preferred AI provider:

   For OpenAI:
   ```env
   AI_PROVIDER=openai
   OPENAI_API_KEY=your_openai_api_key_here
   ```

   For Ollama:
   ```env
   AI_PROVIDER=ollama
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=llama2
   ```

## Running the Bot

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## Available Commands

- `/config` - Show current AI provider configuration
- `/personalities` - List all available personalities
- `/einstein` - Talk to Albert Einstein
- `/shakespeare` - Talk to William Shakespeare

## Adding New Personalities

Add new personalities in `src/types/personality.ts` following the existing format.

## AI Providers

### OpenAI
The bot can use OpenAI's GPT models. You'll need an API key from OpenAI.

### Ollama
The bot can use local Ollama models. Make sure you have Ollama installed and running locally, or specify a remote Ollama server URL.

Supported configuration:
- `OLLAMA_BASE_URL`: The URL where Ollama is running (default: http://localhost:11434)
- `OLLAMA_MODEL`: The model to use (default: llama2)