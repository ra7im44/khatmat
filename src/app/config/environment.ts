const runtimeApiKey = (globalThis as { __env?: { GEMINI_API_KEY?: string } }).__env?.GEMINI_API_KEY;

export const environment = {
  geminiApiKey: runtimeApiKey ?? '',
};
