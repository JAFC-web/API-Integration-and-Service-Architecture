const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

async function getJson(response, apiName) {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    throw new Error(`${apiName} no devolvio JSON :,U`);
  }

  return response.json();
}

async function searchSpaceVideos(query) {
  const apiKey = process.env.YOUTUBE_API_KEY;

  const params = new URLSearchParams({
    part: 'snippet',
    q: `${query} space astronomy`,
    maxResults: '5',
    type: 'video',
    key: apiKey
  });

  const response = await fetch(`${YOUTUBE_SEARCH_URL}?${params}`);
  const data = await getJson(response, 'YouTube');

  if (!response.ok) {
    const error = new Error(data.error?.message || 'No se pudo consultar YouTube.');
    error.status = response.status;
    throw error;
  }

  const videos = data.items.map((item) => ({
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails.medium.url,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`
  }));

  if (videos.length === 0) {
    const error = new Error('No se encontraron videos.');
    error.status = 404;
    throw error;
  }

  return videos;
}

module.exports = { searchSpaceVideos };

