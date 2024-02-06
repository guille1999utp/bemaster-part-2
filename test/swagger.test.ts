import express, { Express } from 'express';
import request from 'supertest';
import swaggerDocs from '../swagger/swagger'; 

const expressApp: Express = express();

const useMock = jest.spyOn(expressApp, 'use');
const getMock = jest.spyOn(expressApp, 'get');

swaggerDocs(expressApp, 4000);

describe('Swagger Endpoint', () => {
  it('should return Swagger UI page', async () => {
    const response = await request(expressApp).get('/api-docs/');
    expect(response.status).toBe(200);
    expect(response.header['content-type']).toContain('text/html');
  });

  it('deberia retornar Swagger JSON', async () => {
    const response = await request(expressApp).get('/swagger.json');
    expect(response.status).toBe(200);
    expect(response.header['content-type']).toContain('application/json');
  });

  it('deberia llamar expressApp.use y expressApp.get', () => {
    expect(useMock).toHaveBeenCalled();
    expect(getMock).toHaveBeenCalled();
  });
});
