import testServer from "./utils/testServer";
import user from "../src/routes/user";
const request = testServer(user);

describe("User Endpoints", () => {
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
});