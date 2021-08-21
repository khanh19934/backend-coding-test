import buildSchemas from './schemas';
import sqlite from 'sqlite3';
import startServer from './app';
import Logger from './libs/logger';
import express from 'express';

const port = 8010;
const verboseSqlite3 = sqlite.verbose();
const db = new verboseSqlite3.Database(':memory:');

const app = express();

db.serialize(() => {
  buildSchemas(db);

  const server = startServer(app, db);

  server.listen(port, () => Logger.debug(`App started and listening on port ${port}`));
});
