type AppConfig = {
  baseUrl: string;
  ai: {
    enabled: boolean;
    baseUrl: string;
    apiKey: string;
    model: string;
  };
};

const DEFAULT_BASE_URL = 'https://automationexercise.com';
const DEFAULT_AI_BASE_URL = 'http://localhost:11434/v1';
const DEFAULT_AI_MODEL = 'llama3.2:3b';
const DEFAULT_AI_API_KEY = 'ollama';

function readEnv(name: string, fallback: string): string {
  const value = process.env[name];
  if (value === undefined) {
    return fallback;
  }
  const trimmed = value.trim();

  return trimmed === '' ? fallback : trimmed;
}
function readBooleanEnv(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (value === undefined) {
    return fallback;
  }
  const normalized = value.trim().toLowerCase();
  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return false;
  }
  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  return fallback;
}
export const appConfig: AppConfig = {
  baseUrl: readEnv('PLAYWRIGHT_BASE_URL', DEFAULT_BASE_URL),
  ai: {
    enabled: readBooleanEnv('AI_ENABLED', true),
    baseUrl: readEnv('AI_BASE_URL', DEFAULT_AI_BASE_URL),
    apiKey: readEnv('AI_API_KEY', DEFAULT_AI_API_KEY),
    model: readEnv('AI_MODEL', DEFAULT_AI_MODEL),
  },
} as const;
