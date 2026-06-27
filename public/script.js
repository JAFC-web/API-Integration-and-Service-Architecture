const apodButton = document.getElementById('apodButton');
const videoButton = document.getElementById('videoButton');
const mastodonButton = document.getElementById('mastodonButton');
const placesButton = document.getElementById('placesButton');

const apodResult = document.getElementById('apodResult');
const videoResult = document.getElementById('videoResult');
const mastodonResult = document.getElementById('mastodonResult');
const placesResult = document.getElementById('placesResult');

function showLoading(element) {
  element.innerHTML = '<p>Consultando API...</p>';
}

function showError(element, message) {
  element.innerHTML = `<p class="error">${message}</p>`;
}

async function getData(url) {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Ocurrio un error.');
  }

  return data;
}

apodButton.addEventListener('click', async () => {
  try {
    showLoading(apodResult);
    const apod = await getData('/api/apod');
    const media = apod.mediaType === 'image'
      ? `<img src="${apod.imageUrl}" alt="${apod.title}">`
      : `<p><a href="${apod.imageUrl}" target="_blank">Abrir contenido de NASA</a></p>`;

    apodResult.innerHTML = `
      ${media}
      <h3>${apod.title}</h3>
      <p><strong>Fecha:</strong> ${apod.date}</p>
      <p>${apod.description}</p>
    `;
  } catch (error) {
    showError(apodResult, error.message);
  }
});

videoButton.addEventListener('click', async () => {
  const query = document.getElementById('videoInput').value.trim();

  if (!query) {
    showError(videoResult, 'Escribe un tema para buscar videos.');
    return;
  }

  try {
    showLoading(videoResult);
    const videos = await getData(`/api/videos?q=${encodeURIComponent(query)}`);

    videoResult.innerHTML = videos.map((video) => `
      <div class="video">
        <img src="${video.thumbnail}" alt="${video.title}">
        <div>
          <h3>${video.title}</h3>
          <p><strong>Canal:</strong> ${video.channel}</p>
          <a href="${video.url}" target="_blank">Abrir video</a>
        </div>
      </div>
    `).join('');
  } catch (error) {
    showError(videoResult, error.message);
  }
});

mastodonButton.addEventListener('click', async () => {
  const query = document.getElementById('mastodonInput').value.trim();
  const url = query ? `/api/mastodon?q=${encodeURIComponent(query)}` : '/api/mastodon';

  try {
    showLoading(mastodonResult);
    const posts = await getData(url);

    mastodonResult.innerHTML = posts.map((post) => `
      <div class="post">
        <h3>${post.author}</h3>
        <p><strong>@${post.username}</strong></p>
        <p>${post.content || 'Publicacion sin texto disponible.'}</p>
        <p><strong>Favoritos:</strong> ${post.favorites} | <strong>Compartidos:</strong> ${post.reblogs}</p>
        <a href="${post.url}" target="_blank">Abrir publicacion</a>
      </div>
    `).join('');
  } catch (error) {
    showError(mastodonResult, error.message);
  }
});

placesButton.addEventListener('click', async () => {
  try {
    showLoading(placesResult);
    const data = await getData('/api/places');

    placesResult.innerHTML = `
      <img src="${data.mapUrl}" alt="Mapa de lugares astronomicos">
      <ul>
        ${data.places.map((place) => `<li><strong>${place.name}</strong>: ${place.address}</li>`).join('')}
      </ul>
    `;
  } catch (error) {
    showError(placesResult, error.message);
  }
});
