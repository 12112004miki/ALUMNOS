import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/datasource";
import { Materia } from "../entities/Materia";

const router = Router();
const repo = () => AppDataSource.getRepository(Materia);

// GET /api/materias
router.get("/", async (_, res: Response) => {
  const materias = await repo().find();
  return res.json(materias);
});

// GET /api/materias/:id
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const materia = await repo().findOne({ where: { MateriaId: id } });

  if (!materia) return res.status(404).json({ message: "Materia no encontrada" });
  res.json(materia);
});

// POST /api/materias
router.post("/", async (req: Request, res: Response) => {
  try {
    const { Nombre } = req.body;

    if (!Nombre)
      return res.status(400).json({ message: "Nombre es requerido" });

    const materia = repo().create(req.body);
    const saved = await repo().save(materia);

    return res.status(201).json(saved);
  } catch (err) {
    return res.status(500).json({ error: "Error al crear materia" });
  }
});

// PUT /api/materias/:id
router.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const materia = await repo().findOne({ where: { MateriaId: id } });

  if (!materia) return res.status(404).json({ message: "Materia no encontrada" });

  repo().merge(materia, req.body);
  const updated = await repo().save(materia);

  res.json(updated);
});

// DELETE /api/materias/:id
router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await repo().delete(id);

  if (result.affected === 0)
    return res.status(404).json({ message: "Materia no encontrada" });

  res.json({ message: "Materia eliminada correctamente" });
});

export default router;
