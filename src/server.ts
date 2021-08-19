import buildSchemas from './schemas';
import sqlite from 'sqlite3';
import startServer from './app';
import Logger from './libs/logger';

const port = 8010;
const verboseSqlite3 = sqlite.verbose();
const db = new verboseSqlite3.Database(':memory:');

db.serialize(() => {
  buildSchemas(db);

  const app = startServer(db);

  app.listen(port, () =>
    Logger.debug(`App started and listening on port ${port}`)
  );
});
