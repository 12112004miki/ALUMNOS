import { TareaService } from "../../src/services/tarea.service";
import { Tarea } from "../../src/entities/Tarea";

describe("TareaService - Unit tests", () => {
  let service: TareaService;

  beforeEach(() => {
    service = new TareaService();
  });

  // -----------------------------
  // Tests básicos existentes
  // -----------------------------
  it("Debe crear una tarea correctamente", () => {
    const data = {
      AlumnoId: 1,
      MateriaId: 2,
      Titulo: "Ejercicio de Algebra",
      FechaEntrega: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    const tarea: Tarea = service.createTarea(data);
    expect(tarea.AlumnoId).toBe(data.AlumnoId);
    expect(tarea.MateriaId).toBe(data.MateriaId);
    expect(tarea.Titulo).toBe(data.Titulo);
    expect(tarea.Estado).toBe("Pendiente");
    expect(tarea.FechaCreacion).toBeInstanceOf(Date);
  });

  it("Debe lanzar error si falta AlumnoId o MateriaId", () => {
    expect(() => service.createTarea({} as any)).toThrow("AlumnoId es obligatorio");
    expect(() => service.createTarea({ AlumnoId: 1 } as any)).toThrow("MateriaId es obligatorio");
  });

  it("Debe lanzar error si FechaEntrega es anterior a hoy", () => {
    const data = {
      AlumnoId: 1,
      MateriaId: 2,
      Titulo: "Tarea pasada",
      FechaEntrega: new Date(Date.now() - 24 * 60 * 60 * 1000),
    };
    expect(() => service.createTarea(data)).toThrow("FechaEntrega no puede ser anterior a hoy");
  });

  it("Debe cambiar el estado de la tarea correctamente", () => {
    const data = {
      AlumnoId: 1,
      MateriaId: 2,
      Titulo: "Tarea test",
      FechaEntrega: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    const tarea = service.createTarea(data);
    service.changeEstado(tarea, "Entregada");
    expect(tarea.Estado).toBe("Entregada");
    service.changeEstado(tarea, "Atrasada");
    expect(tarea.Estado).toBe("Atrasada");
  });

  it("Debe lanzar error al asignar un estado inválido", () => {
    const data = {
      AlumnoId: 1,
      MateriaId: 2,
      Titulo: "Tarea test",
      FechaEntrega: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    const tarea = service.createTarea(data);
    expect(() => service.changeEstado(tarea, "Invalido")).toThrow(
      "Estado inválido. Solo se permiten: Pendiente, Entregada, Atrasada"
    );
  });

  // -----------------------------
  // Tests adicionales
  // -----------------------------

  it("Debe crear una tarea con estado 'Entregada' directamente", () => {
    const data = {
      AlumnoId: 3,
      MateriaId: 4,
      Titulo: "Tarea entregada",
      FechaEntrega: new Date(Date.now() + 24 * 60 * 60 * 1000),
      Estado: "Entregada",
    };
    const tarea = service.createTarea(data);
    expect(tarea.Estado).toBe("Entregada");
  });

  it("Debe asignar descripción vacía si no se pasa", () => {
    const data = {
      AlumnoId: 1,
      MateriaId: 2,
      Titulo: "Tarea sin descripción",
      FechaEntrega: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    const tarea = service.createTarea(data);
    expect(tarea.Descripcion).toBe("");
  });

  it("Debe permitir cambiar el estado varias veces", () => {
    const data = {
      AlumnoId: 1,
      MateriaId: 2,
      Titulo: "Tarea cambios de estado",
      FechaEntrega: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    const tarea = service.createTarea(data);
    service.changeEstado(tarea, "Entregada");
    expect(tarea.Estado).toBe("Entregada");
    service.changeEstado(tarea, "Atrasada");
    expect(tarea.Estado).toBe("Atrasada");
    service.changeEstado(tarea, "Pendiente");
    expect(tarea.Estado).toBe("Pendiente");
  });

  it("Debe aceptar FechaEntrega igual a hoy", () => {
    const fechaHoy = new Date();
    const data = {
      AlumnoId: 1,
      MateriaId: 2,
      Titulo: "Tarea hoy",
      FechaEntrega: fechaHoy,
    };
    const tarea = service.createTarea(data);
    expect(tarea.FechaEntrega).toBe(fechaHoy);
  });

  it("Debe crear múltiples tareas y verificar títulos distintos", () => {
    const t1 = service.createTarea({
      AlumnoId: 1,
      MateriaId: 1,
      Titulo: "Tarea 1",
      FechaEntrega: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    const t2 = service.createTarea({
      AlumnoId: 2,
      MateriaId: 2,
      Titulo: "Tarea 2",
      FechaEntrega: new Date(Date.now() + 48 * 60 * 60 * 1000),
    });
    expect(t1.Titulo).not.toBe(t2.Titulo);
  });

  it("Debe validar Titulo mínimo 3 caracteres", () => {
    expect(() =>
      service.createTarea({
        AlumnoId: 1,
        MateriaId: 1,
        Titulo: "A",
        FechaEntrega: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
    ).toThrow();
  });

  it("Debe aceptar Titulo largo con 100 caracteres", () => {
    const titulo = "T".repeat(100);
    const tarea = service.createTarea({
      AlumnoId: 1,
      MateriaId: 1,
      Titulo: titulo,
      FechaEntrega: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    expect(tarea.Titulo).toBe(titulo);
  });

  it("Debe validar FechaEntrega máxima (+1 año)", () => {
    const fechaMax = new Date();
    fechaMax.setFullYear(fechaMax.getFullYear() + 1);
    const tarea = service.createTarea({
      AlumnoId: 1,
      MateriaId: 1,
      Titulo: "Tarea límite",
      FechaEntrega: fechaMax,
    });
    expect(tarea.FechaEntrega).toBe(fechaMax);
  });

  it("Debe permitir caracteres especiales y emojis en Titulo", () => {
    const tarea = service.createTarea({
      AlumnoId: 1,
      MateriaId: 1,
      Titulo: "Tarea 🎉 Especial!",
      FechaEntrega: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    expect(tarea.Titulo).toBe("Tarea 🎉 Especial!");
  });

  it("Debe lanzar error si se intenta cambiar estado a null o undefined", () => {
    const tarea = service.createTarea({
      AlumnoId: 1,
      MateriaId: 1,
      Titulo: "Tarea test",
      FechaEntrega: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    expect(() => service.changeEstado(tarea, null as any)).toThrow();
    expect(() => service.changeEstado(tarea, undefined as any)).toThrow();
  });
});
