import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`Server iniciou na porta ${PORT}`));

app.use(express.static(path.join(__dirname, 'public')));

