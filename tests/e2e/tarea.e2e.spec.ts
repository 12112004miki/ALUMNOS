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

describe("Tareas E2E", () => {
  let alumnoId: number;
  let materiaId: number;

  beforeAll(async () => {
    const repoAlumno = AppDataSource.getRepository("Alumnos");
    const repoMateria = AppDataSource.getRepository("Materias");

    const alumno = await repoAlumno.save({ Nombre: "E2E", Apellido: "Alumno", Correo: `alumno-${Date.now()}@example.com` });
    const materia = await repoMateria.save({ Nombre: "E2E Materia", Descripcion: "Prueba" });

    alumnoId = alumno.AlumnoId;
    materiaId = materia.MateriaId;
  });

  afterAll(async () => {
    await AppDataSource.getRepository("Tareas").delete({});
    await AppDataSource.getRepository("Alumnos").delete({ AlumnoId: alumnoId });
    await AppDataSource.getRepository("Materias").delete({ MateriaId: materiaId });
  });

  it("POST /api/tareas -> crea tarea y GET /api/tareas/:id -> la devuelve", async () => {
    const payload = {
      AlumnoId: alumnoId,
      MateriaId: materiaId,
      Titulo: "Tarea E2E",
      Descripcion: "Descripción de prueba",
      FechaEntrega: new Date().toISOString()
    };

    const resPost = await request(app).post("/api/tareas").send(payload);
    expect(resPost.status).toBe(201);
    expect(resPost.body.TareaId).toBeDefined();

    const tareaId = resPost.body.TareaId;

    const resGet = await request(app).get(`/api/tareas/${tareaId}`);
    expect(resGet.status).toBe(200);
    expect(resGet.body.Titulo).toBe(payload.Titulo);
  });
});
