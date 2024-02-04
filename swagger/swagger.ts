import { Request, Response, Express } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API',
            version: '1.0.0',
        }
    },
    apis: ['src/routes/*.ts','app.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app:Express,port:number) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/swagger.json', (req: Request, res:Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    console.log('Swagger UI iniciado en "/api-docs" y app en "/" en el puerto ' + port )
}

export default swaggerDocs;