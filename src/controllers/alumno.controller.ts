import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/datasource";
import { Alumno } from "../entities/Alumno";

const router = Router();
const repo = () => AppDataSource.getRepository(Alumno);

// GET /api/alumnos
router.get("/", async (_, res: Response) => {
  const alumnos = await repo().find();
  return res.json(alumnos);
});

// GET /api/alumnos/:id
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const alumno = await repo().findOne({ where: { AlumnoId: id } });

  if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });
  res.json(alumno);
});

// POST /api/alumnos
router.post("/", async (req: Request, res: Response) => {
  try {
    const { Nombre, Apellido, Correo } = req.body;

    if (!Nombre || !Apellido || !Correo)
      return res.status(400).json({ message: "Faltan campos requeridos" });

    const existe = await repo().findOne({ where: { Correo } });
    if (existe)
      return res.status(409).json({ message: "Ya existe un alumno con ese correo" });

    const nuevo = repo().create(req.body);
    const saved = await repo().save(nuevo);

    return res.status(201).json(saved);
  } catch (error) {
    return res.status(500).json({ error: "Error al crear el alumno" });
  }
});

// PUT /api/alumnos/:id
router.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const alumno = await repo().findOne({ where: { AlumnoId: id } });

  if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });

  repo().merge(alumno, req.body);
  const actualizado = await repo().save(alumno);

  return res.json(actualizado);
});

// DELETE /api/alumnos/:id
router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await repo().delete(id);

  if (result.affected === 0)
    return res.status(404).json({ message: "Alumno no encontrado" });

  return res.json({ message: "Alumno eliminado correctamente" });
});

export default router;
