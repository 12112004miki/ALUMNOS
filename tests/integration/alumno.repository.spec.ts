import { AppDataSource } from "../../src/config/datasource";
import { Alumno } from "../../src/entities/Alumno";

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe("Alumno Repository - Integration Test", () => {

  it("Debería guardar un alumno y recuperarlo desde la base de datos", async () => {
    const repo = AppDataSource.getRepository(Alumno);

    const alumnoNuevo = repo.create({
      Nombre: "Int",
      Apellido: "Test",
      Correo: `int-${Date.now()}@example.com`,
    });

    const alumnoGuardado = await repo.save(alumnoNuevo);

    const alumnoEncontrado = await repo.findOneBy({ AlumnoId: alumnoGuardado.AlumnoId });

    expect(alumnoEncontrado).not.toBeNull();
    expect(alumnoEncontrado!.Correo).toBe(alumnoGuardado.Correo);

    // Cleanup
    await repo.delete({ AlumnoId: alumnoGuardado.AlumnoId });
  });

  it("Debería listar todos los alumnos", async () => {
    const repo = AppDataSource.getRepository(Alumno);

    const lista = await repo.find();
    expect(Array.isArray(lista)).toBe(true);
  });

});
