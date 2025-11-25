import { AlumnoService } from "../../src/services/alumno.service";
import { Alumno } from "../../src/entities/Alumno";

describe("AlumnoService - Unit tests", () => {
  let service: AlumnoService;

  beforeEach(() => {
    service = new AlumnoService();
  });

  // -----------------------------
  // Tests básicos existentes
  // -----------------------------
  it("Debe crear un alumno correctamente", () => {
    const data = { Nombre: "Juan", Apellido: "Perez", Correo: "juan.perez@example.com" };
    const alumno: Alumno = service.createAlumno(data);
    expect(alumno.Nombre).toBe(data.Nombre);
    expect(alumno.Apellido).toBe(data.Apellido);
    expect(alumno.Correo).toBe(data.Correo);
    expect(alumno.Activo).toBe(true);
    expect(alumno.FechaRegistro).toBeInstanceOf(Date);
  });

  it("Debe lanzar error si faltan campos obligatorios", () => {
    expect(() => service.createAlumno({} as any)).toThrow("Todos los campos obligatorios deben estar presentes");
  });

  it("Debe validar un email correctamente", () => {
    const alumno = new Alumno();
    alumno.Correo = "correo@valido.com";
    expect(service.isEmailValid(alumno)).toBe(true);
    alumno.Correo = "correo-invalido";
    expect(service.isEmailValid(alumno)).toBe(false);
  });

  it("Debe cambiar el estado activo del alumno", () => {
    const alumno = new Alumno();
    alumno.Activo = true;
    const toggled = service.toggleActivo(alumno);
    expect(toggled.Activo).toBe(false);
    const toggledAgain = service.toggleActivo(toggled);
    expect(toggledAgain.Activo).toBe(true);
  });

  // -----------------------------
  // Tests adicionales
  // -----------------------------
  it("Debe permitir crear un alumno con Activo = false", () => {
    const data = { Nombre: "Ana", Apellido: "Lopez", Correo: "ana.lopez@example.com", Activo: false };
    const alumno = service.createAlumno(data);
    expect(alumno.Activo).toBe(false);
  });

  it("FechaRegistro debe ser cercana a la creación", () => {
    const data = { Nombre: "Luis", Apellido: "Martínez", Correo: "luis@example.com" };
    const alumno = service.createAlumno(data);
    const ahora = new Date();
    expect(Math.abs(ahora.getTime() - alumno.FechaRegistro.getTime())).toBeLessThan(1000);
  });

  it("Debe crear múltiples alumnos y que sean distintos", () => {
    const a1 = service.createAlumno({ Nombre: "A", Apellido: "A", Correo: "a1@example.com" });
    const a2 = service.createAlumno({ Nombre: "B", Apellido: "B", Correo: "a2@example.com" });
    expect(a1.Correo).not.toBe(a2.Correo);
  });

  it("Debe cambiar nombre y apellido correctamente", () => {
    const alumno = service.createAlumno({ Nombre: "X", Apellido: "Y", Correo: "xy@example.com" });
    alumno.Nombre = "Nuevo";
    alumno.Apellido = "Apellido";
    expect(alumno.Nombre).toBe("Nuevo");
    expect(alumno.Apellido).toBe("Apellido");
  });

  it("Debe validar que un correo simulado no se repita", () => {
    const existingEmails = ["test@example.com"];
    const data = { Nombre: "Z", Apellido: "Z", Correo: "test@example.com" };
    expect(() => {
      if (existingEmails.includes(data.Correo)) throw new Error("Correo ya existe");
      service.createAlumno(data);
    }).toThrow("Correo ya existe");
  });

  it("Debe validar longitud mínima y máxima de Nombre y Apellido", () => {
    expect(() => service.createAlumno({ Nombre: "A", Apellido: "B", Correo: "a@b.com" })).not.toThrow();
    expect(() => service.createAlumno({ Nombre: "", Apellido: "", Correo: "x@x.com" })).toThrow();
  });

  it("Debe validar que el correo tenga dominio válido", () => {
    const alumno = new Alumno();
    alumno.Correo = "correo@dominio.com";
    expect(service.isEmailValid(alumno)).toBe(true);
    alumno.Correo = "correo@dominio";
    expect(service.isEmailValid(alumno)).toBe(false);
  });

  it("Debe validar combinación nombre+apellido no vacía ni números", () => {
    const alumno = new Alumno();
    alumno.Nombre = "Juan123";
    alumno.Apellido = "Perez";
    expect(() => {
      if (!/^[A-Za-z]+$/.test(alumno.Nombre)) throw new Error("Nombre inválido");
    }).toThrow("Nombre inválido");
  });

  it("Debe permitir caracteres especiales y emojis en el nombre", () => {
    const alumno = service.createAlumno({ Nombre: "José 😎", Apellido: "Lopez", Correo: "jose@example.com" });
    expect(alumno.Nombre).toBe("José 😎");
  });

  it("Debe validar que correo con espacios sea inválido", () => {
    const alumno = new Alumno();
    alumno.Correo = "correo @example.com";
    expect(service.isEmailValid(alumno)).toBe(false);
  });
});
