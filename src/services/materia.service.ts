import { Materia } from "../entities/Materia";

export class MateriaService {
  // Crear una materia
  createMateria(data: Partial<Materia>): Materia {
    if (!data.Nombre) {
      throw new Error("El nombre de la materia es obligatorio");
    }
    const materia = new Materia();
    materia.Nombre = data.Nombre;
    materia.Descripcion = data.Descripcion ?? "";
    materia.Activo = data.Activo ?? true;
    return materia;
  }

  // Activar / desactivar materia
  toggleActivo(materia: Materia): Materia {
    materia.Activo = !materia.Activo;
    return materia;
  }

  // Validar que el nombre tenga mínimo 3 caracteres
  isNombreValido(materia: Materia): boolean {
    return materia.Nombre.length >= 3;
  }
}
