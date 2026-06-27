require('dotenv').config();

const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Space Explorer running at http://localhost:${PORT}`);
});

