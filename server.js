import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const PORT = process.env.PORT || 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
