import request from "supertest";
import { createApp } from "../../src/app";
import { AppDataSource } from "../../src/config/datasource";

let app: any;

beforeAll(async () => {
  await AppDataSource.initialize();
  app = await createApp();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe("Alumnos E2E", () => {
  it("POST /api/alumnos -> crea un alumno y GET /api/alumnos/:id -> lo devuelve", async () => {
    const payload = {
      Nombre: "E2E",
      Apellido: "Tester",
      Correo: `e2e-${Date.now()}@example.com`
    };

    // Crear alumno
    const resPost = await request(app).post("/api/alumnos").send(payload);
    expect(resPost.status).toBe(201);
    expect(resPost.body.AlumnoId).toBeDefined();

    const alumnoId = resPost.body.AlumnoId;

    // Obtener alumno
    const resGet = await request(app).get(`/api/alumnos/${alumnoId}`);
    expect(resGet.status).toBe(200);
    expect(resGet.body.Correo).toBe(payload.Correo);

    // Limpiar datos
    await AppDataSource.getRepository("Alumnos").delete({ AlumnoId: alumnoId });
  });

  it("GET /api/alumnos -> lista todos los alumnos", async () => {
    const res = await request(app).get("/api/alumnos");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

