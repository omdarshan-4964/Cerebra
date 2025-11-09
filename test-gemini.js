const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyCDo_WCBU5HoxV-gRX_jRQtYyGEI6VHPuk');

async function test() {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent('Say hello');
  console.log(result.response.text());
}

test();
