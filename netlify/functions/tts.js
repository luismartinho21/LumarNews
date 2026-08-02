import { Buffer } from 'node:buffer';

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { text } = JSON.parse(event.body);

    if (!text) {
      return { statusCode: 400, body: 'Missing text parameter' };
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: 'Server Configuration Error: Missing API Key' };
    }

    // Voice ID fornecido pelo utilizador
    const voiceId = 'JBFqnCBsd6RMkjVDRZzb';

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('ElevenLabs Error:', errText);
      return { statusCode: response.status, body: errText };
    }

    const audioBuffer = await response.arrayBuffer();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600' // cache for 1 hour to save credits if identical
      },
      body: Buffer.from(audioBuffer).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Function error:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
