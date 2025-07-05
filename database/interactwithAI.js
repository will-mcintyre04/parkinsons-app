import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAIKEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

export async function extractMedicationAndDosage(transcript: string) {
  const prompt = `
From the following sentence, extract only the medication name and dosage as JSON like:
{ "medication": "Advil", "dosage": "200mg" }

If no medication or dosage is found, return:
{ "medication": null, "dosage": null }

Please return raw JSON only (no triple backticks or formatting).

Sentence: "${transcript}"
`;

  try {
    console.log('🧠 Prompt being sent:\n', prompt);

//"mistralai/mistral-7b-instruct"

    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [{ role: 'user', content: prompt }],
    });

    let raw = response.choices[0].message.content || '';
    console.log('📦 Raw response from model:\n', raw);

    // Try to extract JSON from markdown-style block
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);

    let jsonBlock = raw;
    if (match) {
      jsonBlock = match[1].trim();
    } else {
      console.warn('⚠️ No JSON block found. Using raw string.');
    }

    const parsed = JSON.parse(jsonBlock);
    console.log('✅ Parsed JSON:', parsed);

    return {
      medication: parsed.medication ?? null,
      dosage: parsed.dosage ?? null,
    };
  } catch (err) {
    console.error('❌ Failed to extract medication & dosage:', err);
    return { medication: null, dosage: null };
  }
}


export async function generateMotivationalQuote(): Promise<string> {
  const prompt = `
Give me a short motivational quote (1 sentence) that feels encouraging and uplifting. 
It should be casual and kind, like:
- "Small wins add up, great job!"
- "You're doing amazing, keep going!"
Return just the quote, no markdown or explanation.
`;

  try {
    console.log('✨ Prompt sent to model:\n', prompt);

    //"mistralai/mistral-7b-instruct"
    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [{ role: 'user', content: prompt }],
    });

    const quote = response.choices[0].message.content?.trim();

    if (!quote) {
      console.warn('No quote found in response.');
      return 'You’re doing great!';
    }

    console.log('💬 Motivational quote:', quote);
    return quote;
  } catch (err) {
    console.error('❌ Failed to generate motivational quote:', err);
    return 'Keep pushing forward — you got this!';
  }
}