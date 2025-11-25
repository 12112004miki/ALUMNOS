import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/datasource";
import { Tarea } from "../entities/Tarea";
import { Alumno } from "../entities/Alumno";
import { Materia } from "../entities/Materia";

const router = Router();
const tareaRepo = () => AppDataSource.getRepository(Tarea);
const alumnoRepo = () => AppDataSource.getRepository(Alumno);
const materiaRepo = () => AppDataSource.getRepository(Materia);

const ESTADOS_VALIDOS = ["Pendiente", "Entregada", "Atrasada"];

// GET /api/tareas
router.get("/", async (_, res: Response) => {
  const tareas = await tareaRepo().find({
    relations: ["alumno", "materia"],
  });

  return res.json(tareas);
});

// GET /api/tareas/:id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const tarea = await tareaRepo().findOne({
    where: { TareaId: id },
    relations: ["alumno", "materia"],
  });

  if (!tarea) return res.status(404).json({ message: "Tarea no encontrada" });

  return res.json(tarea);
});

// GET /api/tareas/alumno/:id
router.get("/alumno/:id", async (req, res) => {
  const id = Number(req.params.id);

  const tareas = await tareaRepo().find({
    where: { AlumnoId: id },
    relations: ["materia"],
  });

  return res.json(tareas);
});

// GET /api/tareas/materia/:id
router.get("/materia/:id", async (req, res) => {
  const id = Number(req.params.id);

  const tareas = await tareaRepo().find({
    where: { MateriaId: id },
    relations: ["alumno"],
  });

  return res.json(tareas);
});

// POST /api/tareas
router.post("/", async (req, res) => {
  try {
    const { AlumnoId, MateriaId, Titulo, FechaEntrega, Estado } = req.body;

    if (!AlumnoId || !MateriaId || !Titulo || !FechaEntrega)
      return res.status(400).json({ message: "Faltan campos requeridos" });

    if (Estado && !ESTADOS_VALIDOS.includes(Estado))
      return res.status(400).json({ message: "Estado inválido" });

    const existeAlumno = await alumnoRepo().findOne({ where: { AlumnoId } });
    if (!existeAlumno)
      return res.status(404).json({ message: "Alumno no existe" });

    const existeMateria = await materiaRepo().findOne({ where: { MateriaId } });
    if (!existeMateria)
      return res.status(404).json({ message: "Materia no existe" });

    const nueva = tareaRepo().create(req.body);
    const saved = await tareaRepo().save(nueva);

    return res.status(201).json(saved);
  } catch (err) {
    return res.status(500).json({ error: "Error al crear tarea" });
  }
});

// PUT /api/tareas/:id
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const tarea = await tareaRepo().findOne({ where: { TareaId: id } });

  if (!tarea) return res.status(404).json({ message: "Tarea no encontrada" });

  const { Estado } = req.body;

  if (Estado && !ESTADOS_VALIDOS.includes(Estado))
    return res.status(400).json({ message: "Estado inválido" });

  tareaRepo().merge(tarea, req.body);
  const updated = await tareaRepo().save(tarea);

  return res.json(updated);
});

// DELETE /api/tareas/:id
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const result = await tareaRepo().delete(id);

  if (result.affected === 0)
    return res.status(404).json({ message: "Tarea no encontrada" });

  return res.json({ message: "Tarea eliminada correctamente" });
});

export default router;
