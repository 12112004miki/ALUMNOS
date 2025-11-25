import { Router } from "express";
import alumnoController from "../controllers/alumno.controller";
import materiaController from "../controllers/materia.controller";
import tareaController from "../controllers/tarea.controller";

const router = Router();

router.use("/alumnos", alumnoController);
router.use("/materias", materiaController);
router.use("/tareas", tareaController);

export default router;
