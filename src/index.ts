if (process.env.PORT) {
    require('newrelic');
}

import * as debug from 'debug';
import * as http from 'http';
import * as config from 'config';
import {logger} from './middleware/common/logger';
import App from './app';

debug('ts-express:server');

const port = normalizePort(process.env.PORT || config.get('express.port'));

logger.info(`Listening on ${port}...`);

const server = http.createServer(App);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val: number | string): number | string | boolean {
    const portNumber: number = typeof val === 'string' ? parseInt(val, 10) : val;
    if (isNaN(portNumber)) return val;
    else if (portNumber >= 0) return portNumber;
    else return false;
}

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(): void {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    logger.info(
        `------------
       Server Started
       Express: ${bind}
      `
    );
}