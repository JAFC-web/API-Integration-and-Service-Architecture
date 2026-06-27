const express = require('express');
const { getApod } = require('../services/nasaService');
const { searchSpaceVideos } = require('../services/youtubeService');
const { searchSpacePosts } = require('../services/mastodonService');
const { getSpacePlaces } = require('../services/mapboxService');

const router = express.Router();

router.get('/apod', async (req, res) => {
  try {
    const data = await getApod();
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.get('/videos', async (req, res) => {
  try {
    const query = req.query.q || 'NASA';
    const data = await searchSpaceVideos(query);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.get('/mastodon', async (req, res) => {
  try {
    const data = await searchSpacePosts(req.query.q);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.get('/places', async (req, res) => {
  try {
    const data = await getSpacePlaces();
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

module.exports = router;
