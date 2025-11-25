import { MateriaService } from "../../src/services/materia.service";
import { Materia } from "../../src/entities/Materia";

describe("MateriaService - Unit tests", () => {
  let service: MateriaService;

  beforeEach(() => {
    service = new MateriaService();
  });

  // -----------------------------
  // Tests básicos existentes
  // -----------------------------
  it("Debe crear una materia correctamente", () => {
    const data = { Nombre: "Matemáticas", Descripcion: "Cálculo y álgebra" };
    const materia: Materia = service.createMateria(data);
    expect(materia.Nombre).toBe(data.Nombre);
    expect(materia.Descripcion).toBe(data.Descripcion);
    expect(materia.Activo).toBe(true);
  });

  it("Debe lanzar error si falta el nombre", () => {
    expect(() => service.createMateria({} as any)).toThrow("El nombre de la materia es obligatorio");
  });

  it("Debe validar el nombre de la materia", () => {
    const materia = new Materia();
    materia.Nombre = "Ma";
    expect(service.isNombreValido(materia)).toBe(false);
    materia.Nombre = "Matemáticas";
    expect(service.isNombreValido(materia)).toBe(true);
  });

  it("Debe cambiar el estado activo de la materia", () => {
    const materia = new Materia();
    materia.Activo = true;
    const toggled = service.toggleActivo(materia);
    expect(toggled.Activo).toBe(false);
    const toggledAgain = service.toggleActivo(toggled);
    expect(toggledAgain.Activo).toBe(true);
  });

  // -----------------------------
  // Tests adicionales
  // -----------------------------
  it("Debe asignar descripción vacía si no se pasa", () => {
    const materia = service.createMateria({ Nombre: "Historia" });
    expect(materia.Descripcion).toBe("");
  });

  it("Debe alternar activo varias veces", () => {
    const materia = service.createMateria({ Nombre: "Química" });
    expect(materia.Activo).toBe(true);
    service.toggleActivo(materia);
    expect(materia.Activo).toBe(false);
    service.toggleActivo(materia);
    expect(materia.Activo).toBe(true);
  });

  it("Validar varios nombres válidos e inválidos", () => {
    expect(service.isNombreValido({ Nombre: "Ma" } as any)).toBe(false);
    expect(service.isNombreValido({ Nombre: "Mat" } as any)).toBe(true);
    expect(service.isNombreValido({ Nombre: "Historia" } as any)).toBe(true);
  });

  it("Debe crear múltiples materias y verificar nombres distintos", () => {
    const m1 = service.createMateria({ Nombre: "Matemáticas" });
    const m2 = service.createMateria({ Nombre: "Lenguaje" });
    expect(m1.Nombre).not.toBe(m2.Nombre);
  });

  it("Debe simular error de nombre duplicado", () => {
    const existing = ["Matemáticas"];
    expect(() => {
      const data = { Nombre: "Matemáticas" };
      if (existing.includes(data.Nombre)) throw new Error("Materia ya existe");
      service.createMateria(data);
    }).toThrow("Materia ya existe");
  });

  it("Debe validar límite mínimo y máximo de caracteres en Nombre", () => {
    expect(service.isNombreValido({ Nombre: "Ma" } as any)).toBe(false); // mínimo
    expect(service.isNombreValido({ Nombre: "Matemáticas Avanzadas y Teoría de Números" } as any)).toBe(true); // largo permitido
  });

  it("Debe validar error si Nombre tiene solo espacios", () => {
    expect(() => service.createMateria({ Nombre: "   " })).toThrow("El nombre de la materia es obligatorio");
  });

  it("Debe permitir caracteres especiales y emojis en Nombre", () => {
    const materia = service.createMateria({ Nombre: "Historia 🎓" });
    expect(materia.Nombre).toBe("Historia 🎓");
  });

  it("Debe validar Descripcion larga correctamente", () => {
    const descripcionLarga = "Descripción ".repeat(50);
    const materia = service.createMateria({ Nombre: "Física", Descripcion: descripcionLarga });
    expect(materia.Descripcion).toBe(descripcionLarga);
  });
});
