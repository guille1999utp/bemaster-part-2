import express, { Express } from 'express';
import supertest, { Test } from 'supertest';
import TestAgent from 'supertest/lib/agent';

function testServer(route: (app: Express) => void): TestAgent<Test> {
  const app = express();
  app.use(express.json());
  route(app);
  return supertest(app);
}

export default testServer;
