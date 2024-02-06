import testServer from "./utils/testServer";
import user from "../src/routes/user";
import video from "../src/routes/video";
const request = testServer(user);
const requestVideo = testServer(video);

describe("User validation Endpoints", () => {
  it("devuelve error si no se mandan los demás parámetros", async () => {
    // Nombre faltante
    let res = await request.post("/register").send({
      "correo": "passpg@gmail.com",
      "nickname": "guille199",
      "password": "transformers"
    }).set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
    expect(res.status).toEqual(400);
    expect(res.body.errors).toHaveProperty("body", 'El campo "nombre" es obligatorio');

    // Nickname faltante
    res = await request.post("/register").send({
      "nombre": "guillermo",
      "correo": "passpg@gmail.com",
      "password": "transformers"
    }).set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
    expect(res.status).toEqual(400);
    expect(res.body.errors).toHaveProperty("body", 'El campo "nickname" es obligatorio');

    // Correo faltante
    res = await request.post("/register").send({
      "nombre": "guillermo",
      "nickname": "guille199",
      "password": "transformers"
    }).set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
    expect(res.status).toEqual(400);
    expect(res.body.errors).toHaveProperty("body", 'El campo "correo" es obligatorio');

    // Correo faltante
    res = await request.post("/register").send({
      "nombre": "guillermo",
      "nickname": "guille199",
      "correo": "passpg",
      "password": "transformers"
    }).set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
    expect(res.status).toEqual(400);
    expect(res.body.errors).toHaveProperty("body", 'El campo "correo" debe ser un correo');

    // Contraseña faltante
    res = await request.post("/register").send({
      "nombre": "guillermo",
      "correo": "passpg@gmail.com",
      "nickname": "guille199"
    }).set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
    expect(res.status).toEqual(400);
    expect(res.body.errors).toHaveProperty("body", 'El campo "password" es obligatorio');
  });
  it("solicitia  json web tokens en las rutas de video", async () => {
    // Nombre faltante
    let res = await requestVideo.delete("/video/:id").send().set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    expect(res.status).toEqual(401);
    expect(res.body).toHaveProperty("msg", 'No hay token disponible');

  });

  it("acepta la ruta cuando se otorga jsw", async () => {
    const staticToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NWMxOWY4ZjVkNjc5YzgwY2E4NzFkMjAiLCJpYXQiOjE3MDcxODgxMTEsImV4cCI6MTcwNzM2MDkxMX0.gu19nhGaYRZF27UXFE6lqM9Gz__EOqGWB4uTMulzEsA";
    // Nombre faltante
    let res = await requestVideo.delete("/video/:id").send()
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('x-token', staticToken);
    expect(res.status).toEqual(500);
    expect(res.body).toHaveProperty("message", 'Error al eliminar el video');

  });
});