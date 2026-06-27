const MASTODON_SEARCH_URL = 'https://mastodon.social/api/v2/search';
const MASTODON_TAG_URL = 'https://mastodon.social/api/v1/timelines/tag';
const DEFAULT_TERMS = ['NASA', 'Space', 'Astronomy', 'Galaxy'];

async function getJson(response, apiName) {
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  if (!contentType.includes('json')) {
    throw new Error(`${apiName} no devolvio JSON. Status: ${response.status}. Respuesta: ${text.slice(0, 120)}`);
  }

  return JSON.parse(text);
}

function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>\s*<p>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

async function searchStatuses(term) {
  const params = new URLSearchParams({
    q: term,
    type: 'statuses',
    limit: '5'
  });

  const response = await fetch(`${MASTODON_SEARCH_URL}?${params}`);
  const data = await getJson(response, 'Mastodon');

  if (!response.ok) {
    const error = new Error(data.error || 'No se pudo consultar Mastodon.');
    error.status = response.status;
    throw error;
  }

  return data.statuses.map((status) => ({
    author: status.account.display_name || status.account.username,
    username: status.account.acct,
    content: stripHtml(status.content),
    url: status.url,
    createdAt: status.created_at,
    favorites: status.favourites_count,
    reblogs: status.reblogs_count
  }));
}

async function searchTagStatuses(term) {
  const tag = term.replace(/[^a-z0-9_]/gi, '').toLowerCase();
  const params = new URLSearchParams({ limit: '5' });

  if (!tag) {
    return [];
  }

  const response = await fetch(`${MASTODON_TAG_URL}/${encodeURIComponent(tag)}?${params}`);
  const data = await getJson(response, 'Mastodon');

  if (!response.ok) {
    const error = new Error(data.error || 'No se pudo consultar Mastodon.');
    error.status = response.status;
    throw error;
  }

  return data.map((status) => ({
    author: status.account.display_name || status.account.username,
    username: status.account.acct,
    content: stripHtml(status.content),
    url: status.url,
    createdAt: status.created_at,
    favorites: status.favourites_count,
    reblogs: status.reblogs_count
  }));
}

async function searchSpacePosts(query) {
  const terms = query ? [query] : DEFAULT_TERMS;

  for (const term of terms) {
    const posts = await searchStatuses(term);

    if (posts.length > 0) {
      return posts;
    }

    const tagPosts = await searchTagStatuses(term);

    if (tagPosts.length > 0) {
      return tagPosts;
    }
  }

  const error = new Error('No se encontraron publicaciones de astronomia en Mastodon.');
  error.status = 404;
  throw error;
}

module.exports = { searchSpacePosts };
