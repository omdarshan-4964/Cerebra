const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyCDo_WCBU5HoxV-gRX_jRQtYyGEI6VHPuk');

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // ✅ UPDATED
    const result = await model.generateContent('Say hello');
    console.log('SUCCESS:', result.response.text());
  } catch (error) {
    console.error('ERROR:', error.message);
  }
}

test();