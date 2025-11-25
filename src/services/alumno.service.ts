import { Alumno } from "../entities/Alumno";

export class AlumnoService {
  // lógica de creación (unitaria)
  createAlumno(data: Partial<Alumno>): Alumno {
    if (!data.Nombre || !data.Apellido || !data.Correo) {
      throw new Error("Todos los campos obligatorios deben estar presentes");
    }
    const alumno = new Alumno();
    alumno.Nombre = data.Nombre;
    alumno.Apellido = data.Apellido;
    alumno.Correo = data.Correo;
    alumno.Activo = data.Activo ?? true;
    alumno.FechaRegistro = new Date();
    return alumno;
  }

  // ejemplo de función que valida email
  isEmailValid(alumno: Alumno): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(alumno.Correo);
  }

  // ejemplo de función que activa/desactiva un alumno
  toggleActivo(alumno: Alumno): Alumno {
    alumno.Activo = !alumno.Activo;
    return alumno;
  }
}