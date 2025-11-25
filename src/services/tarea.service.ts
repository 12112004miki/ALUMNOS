import { Tarea } from "../entities/Tarea";

export class TareaService {
  allowedStates = ["Pendiente", "Entregada", "Atrasada"];

  // Crear tarea con validaciones
  createTarea(data: Partial<Tarea>): Tarea {
    if (!data.AlumnoId) {
      throw new Error("AlumnoId es obligatorio");
    }
    if (!data.MateriaId) {
      throw new Error("MateriaId es obligatorio");
    }
    if (!data.Titulo) {
      throw new Error("Titulo es obligatorio");
    }
    if (!data.FechaEntrega) {
      throw new Error("FechaEntrega es obligatoria");
    }
    const fechaHoy = new Date();
    if (data.FechaEntrega < fechaHoy) {
      throw new Error("FechaEntrega no puede ser anterior a hoy");
    }

    const tarea = new Tarea();
    tarea.AlumnoId = data.AlumnoId;
    tarea.MateriaId = data.MateriaId;
    tarea.Titulo = data.Titulo;
    tarea.Descripcion = data.Descripcion ?? "";
    tarea.FechaEntrega = data.FechaEntrega;
    tarea.Estado = this.allowedStates.includes(data.Estado ?? "Pendiente")
      ? data.Estado ?? "Pendiente"
      : "Pendiente";
    tarea.FechaCreacion = new Date();
    return tarea;
  }

  // Cambiar estado de la tarea
  changeEstado(tarea: Tarea, estado: string): Tarea {
    if (!this.allowedStates.includes(estado)) {
      throw new Error(`Estado inválido. Solo se permiten: ${this.allowedStates.join(", ")}`);
    }
    tarea.Estado = estado;
    return tarea;
  }
}
