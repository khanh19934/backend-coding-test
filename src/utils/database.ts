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

export const dbRun =
  (query: string, db: Database, values: any) => (queryCallback: string) => {
    return new Promise((resolve, reject) => {
      db.run(query, values, function (err: Error, rows: any[]) {
        if (err) {
          return reject(err);
        }

        db.all(
          queryCallback,
          // @ts-ignore
          this.lastID,
          function (err: unknown, rows: unknown[]) {
            if (err) {
              return reject(err);
            }

            resolve(rows);
          }
        );
      });
    });
  };
