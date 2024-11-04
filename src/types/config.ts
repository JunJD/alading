export interface OpenAIConfig {
    apiKey: string;
    model: string;
    baseUrl: string;
}

export const DEFAULT_OPENAI_CONFIG: OpenAIConfig = {
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? '',
    model: 'gpt-3.5-turbo',
    baseUrl: process.env.NEXT_PUBLIC_OPENAI_API_URL ?? 'https://api.openai.com/v1',
}; 