import app from '../app.js';

import http from 'http';
import { defaultServerPort } from '../server.config.js';

const server = http.createServer(app);
const port = process.env.PORT || defaultServerPort;
server.listen(port);

server.on('error', err => console.log(`Error when creating server: ${err}`));
server.on('listening', () => console.log(`Server listening on port ${port}`));