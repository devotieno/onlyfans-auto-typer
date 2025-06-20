const fs = require('fs');
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getTemplate(creatorId, trigger) {
  try {
    const personas = JSON.parse(fs.readFileSync('./data/personas.json', 'utf8'));
    const creator = personas.find((c) => c.creatorId === creatorId);
    const template = creator?.templates.find((t) => t.trigger === trigger);
    return template?.text || 'Hey [FanName], how’s it going?';
  } catch (error) {
    console.error('Error reading personas:', error.message);
    return 'Hey [FanName], how’s it going?';
  }
}

async function generateResponse(creatorId, fanName, trigger, tone) {
  const defaultResponse = getTemplate(creatorId, trigger).replace('[FanName]', fanName);
  if (!process.env.OPENAI_API_KEY) {
    console.warn('No OpenAI API key provided, using template response.');
    return defaultResponse;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `Generate a short, ${tone} response for a fan named ${fanName} who triggered ${trigger}. Keep it natural and under 50 characters.`,
        },
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('AI Error:', error.message);
    return defaultResponse;
  }
}

module.exports = { getTemplate, generateResponse };