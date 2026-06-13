import { app } from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => {
  console.info(`Infinite Gadget Loop API listening on port ${env.PORT}`);
});

const shutdown = (signal: NodeJS.Signals): void => {
  console.info(`Received ${signal}. Closing HTTP server...`);
  server.close((error) => {
    if (error) {
      console.error('Error during server shutdown', error);
      process.exit(1);
    }

    console.info('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
