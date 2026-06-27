const MAPBOX_GEOCODING_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
const MAPBOX_STATIC_URL = 'https://api.mapbox.com/styles/v1/mapbox/dark-v11/static';
const DEFAULT_CENTER = { lng: -106.0889, lat: 28.6353, zoom: 10 };

async function getJson(response, apiName) {
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  if (!contentType.includes('json')) {
    throw new Error(`${apiName} no devolvio JSON. Status: ${response.status}. Respuesta: ${text.slice(0, 120)}`);
  }

  return JSON.parse(text);
}

async function searchPlace(term, token) {
  const params = new URLSearchParams({
    access_token: token,
    limit: '3'
  });

  const response = await fetch(`${MAPBOX_GEOCODING_URL}/${encodeURIComponent(term)}.json?${params}`);
  const data = await getJson(response, 'Mapbox');

  if (!response.ok) {
    const error = new Error(data.message || 'No se pudo consultar Mapbox.');
    error.status = response.status;
    throw error;
  }

  return data.features.map((feature) => ({
    name: feature.text,
    address: feature.place_name,
    lng: feature.center[0],
    lat: feature.center[1]
  }));
}

function buildStaticMapUrl(places, token) {
  const markers = places
    .slice(0, 9)
    .map((place) => `pin-s-star+2d7ff9(${place.lng},${place.lat})`)
    .join(',');

  const overlay = markers || `pin-s-star+2d7ff9(${DEFAULT_CENTER.lng},${DEFAULT_CENTER.lat})`;
  return `${MAPBOX_STATIC_URL}/${overlay}/auto/700x360?access_token=${token}`;
}

async function getSpacePlaces() {
  const token = process.env.MAPBOX_ACCESS_TOKEN?.trim();

  const searches = await Promise.all([
    searchPlace('observatory', token),
    searchPlace('planetarium', token),
    searchPlace('stargazing', token)
  ]);

  const places = searches.flat().slice(0, 9);

  if (places.length === 0) {
    const error = new Error('No se encontraron lugares de astronomia.');
    error.status = 404;
    throw error;
  }

  return {
    mapUrl: buildStaticMapUrl(places, token),
    places
  };
}

module.exports = { getSpacePlaces };
