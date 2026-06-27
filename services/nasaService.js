const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod';

async function getJson(response, apiName) {
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  if (!contentType.includes('json')) {
    throw new Error(`${apiName} no devolvio JSON. Status: ${response.status}. Respuesta: ${text.slice(0, 120)}`);
  }

  return JSON.parse(text);
}

async function getApod() {
  const apiKey = process.env.NASA_API_KEY?.trim();

  let response;
  let data;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      response = await fetch(`${NASA_APOD_URL}?api_key=${encodeURIComponent(apiKey)}`);
      data = await getJson(response, 'NASA APOD');
      break;
    } catch (error) {
      lastError = error;

      if (attempt === 3) {
        throw lastError;
      }
    }
  }

  if (!response.ok) {
    const error = new Error(data.msg || 'No se pudo consultar NASA APOD.');
    error.status = response.status;
    throw error;
  }

  return {
    title: data.title,
    date: data.date,
    description: data.explanation,
    imageUrl: data.url,
    mediaType: data.media_type
  };
}

module.exports = { getApod };
