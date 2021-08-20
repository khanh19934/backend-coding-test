import { Database } from 'sqlite3';

export const dbQuery = (query: string, db: Database) => {
  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};
