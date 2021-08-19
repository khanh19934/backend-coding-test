import request from "supertest";
import sqlite from "sqlite3";
import startServer from "../app";
import buildSchemas from "../schemas";
const sqlite3 = sqlite.verbose();
const db = new sqlite3.Database(":memory:");

const app = startServer(db);

describe("API tests", () => {
  before((done) => {
    // @ts-ignore
    db.serialize((err: unknown): void => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      done();
    });
  });

  describe("GET /health", () => {
    it("should return health", (done) => {
      request(app)
        .get("/health")
        .expect("Content-Type", /text/)
        .expect(200, done);
    });
  });
});