import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Setup the connection to Local Ollama
 */
const ollama = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
});

/**
 * Core function to communicate with the Local LLM
 */
export async function askLocalAI(htmlSnippet: string, goal: string): Promise<string> {
  const response = await ollama.chat.completions.create({
    model: 'llama3.2:3b',
    temperature: 0.1,
    messages: [
      {
        role: 'system',
        content: `You are a robotic Playwright selector generator.
                RULES:
                1. Return ONLY the selector string.
                2. No conversational text, no explanations, no periods.
                3. Priority: ID > Attribute [href/data-qa] > Text :has-text().`
      },
      {
        role: 'user',
        content: 'Goal: Find "Contact Us". Snippet: <a href="/contact">Contact Us</a>'
      },
      {
        role: 'assistant',
        content: 'a[href="/contact"]'
      },
      {
        role: 'user',
        content: `Goal: Find the selector for "${goal}".
                HTML Snippet: ${htmlSnippet.replace(/\s+/g, ' ').substring(0, 2000)}`
      },
    ],
  });

  let content = response.choices[0].message.content?.trim() || '';

  // --- SANITIZATION LOGIC ---
  if (content.match(/^(based on|i recommend|the selector|here is)/i)) {
    content = content.replace(/^.*?:/s, '').trim();
  }
  // 1. Remove markdown code blocks
  const codeBlockMatch = content.match(/```(?:css|selector|)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    content = codeBlockMatch[1].trim();
  }

  // 2. Take only the first line
  let cleanedSelector = content.split('\n')[0].trim();

  // 3. Remove surrounding quotes/backticks
  cleanedSelector = cleanedSelector.replace(/^[`"']|[`"']$/g, '');

  // 4. Remove CSS brackets
  cleanedSelector = cleanedSelector.split('{')[0].trim();

  // 5. FIX: Aggressive Class Fixer
  // This looks for ".className something" and checks if "something" is a tag or a class
  cleanedSelector = cleanedSelector.replace(/\.([a-zA-Z0-9_-]+)\s+([a-zA-Z0-9_-]+)/g, (match, p1, p2) => {
    const htmlTags = ['li', 'ul', 'div', 'a', 'span', 'button', 'i', 'header', 'footer', 'nav'];
    // If p2 is a known HTML tag, keep the space (it's a descendant)
    if (htmlTags.includes(p2.toLowerCase())) {
      return `.${p1} ${p2}`;
    }
    // Otherwise, it's likely a second class that needs a dot
    console.log(`⚠️ AI returned multiple classes without dots: "${match}". Fixing to ".${p1}.${p2}"`);

    return `.${p1}.${p2}`;
  });

  // 6. Final cleanup of pseudo-elements
  cleanedSelector = cleanedSelector.replace(/::before|::after/g, '').trim();

  return cleanedSelector;
}

/**
 * Wrapper to satisfy strict linter rules
 */
export async function getHealedLocatorOrThrow(html: string, goal: string): Promise<string> {
  const result = await askLocalAI(html, goal);

  if (!result || result === '' || result.includes('{')) {
    throw new Error(`AI Healing Failed: Invalid selector returned for: ${goal}`);
  }

  return result;
}

/**
 * Logs the results of a healing attempt to a file
 */
export function logHealing(original: string, fixed: string, goal: string): void {
  const logMessage = `[${new Date().toLocaleString()}]
GOAL: ${goal}
FAILED: ${original}
FIXED: ${fixed}
--------------------------------------------------\n`;

  const logPath = path.join(__dirname, '../../healing-report.log');

  try {
    fs.appendFileSync(logPath, logMessage);
  } catch (err) {
    console.error('Failed to write to healing-report.log', err);
  }
}
