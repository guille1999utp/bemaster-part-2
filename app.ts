import express from 'express';
import cors from 'cors';
import routeUser from './src/routes/user'
import bodyParser from 'body-parser'
import routeVideo from './src/routes/video'
import './src/database';
import swaggerDocs from './swagger/swagger';
const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());

routeUser(app);
routeVideo(app);

swaggerDocs(app,port);
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});