const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function test() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Say hello' }],
    });
    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI Error:', error.message);
  }
}

test();