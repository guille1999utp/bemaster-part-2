import express from 'express';
import cors from 'cors';
import routeUser from './src/routes/user'
import routeVideo from './src/routes/video'
import './src/database';
import swaggerDocs from './swagger/swagger';
const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

app.use(routeUser)
app.use(routeVideo)

swaggerDocs(app,port);
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});