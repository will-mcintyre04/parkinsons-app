import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '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',
  baseURL: 'https://openrouter.ai/api/v1',
});

export async function extractMedicationAndDosage(transcript: string) {
  const prompt = `
From the following sentence, extract only the medication name and dosage as JSON like:
{ "medication": "Advil", "dosage": "200mg" }

If no medication or dosage is found, return:
{ "medication": null, "dosage": null }

Sentence: "${transcript}"
`;

try {
  console.log('🧠 Prompt being sent:\n', prompt);

  const response = await openai.chat.completions.create({
    model: "deepseek/deepseek-chat-v3-0324:free",
    messages: [{ role: 'user', content: prompt }],
  });

  let raw = response.choices[0].message.content || '';
    console.log('Raw response from model:\n', raw);

    // 🧹 Extract JSON block from Markdown-like format
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);

    if (!match) {
      console.warn('⚠️ No JSON block found in model response.');
      return { medication: null, dosage: null };
    }

    const jsonBlock = match[1].trim();

    const parsed = JSON.parse(jsonBlock);
    console.log('Parsed JSON:\n', parsed);

    return {
      medication: parsed.medication ?? null,
      dosage: parsed.dosage ?? null,
    };
  } catch (err) {
    console.error('Failed to extract medication & dosage:', err);
    return { medication: null, dosage: null };
  }
}