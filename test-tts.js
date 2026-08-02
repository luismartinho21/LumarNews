require('dotenv').config();
const { handler } = require('./netlify/functions/tts');

async function run() {
  const res = await handler({
    httpMethod: 'POST',
    body: JSON.stringify({ text: 'Teste de áudio para verificar o erro' })
  }, {});
  console.log('Status:', res.statusCode);
  if (res.statusCode !== 200) {
    console.log('Body:', res.body);
  }
}

run();
