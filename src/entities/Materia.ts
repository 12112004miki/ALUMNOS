import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Tarea } from "./Tarea";

@Entity({ name: "Materias" })
export class Materia {
  @PrimaryGeneratedColumn()
  MateriaId!: number;

  @Column({ type: "nvarchar", length: 120 })
  Nombre!: string;

  @Column({ type: "nvarchar", length: 255, nullable: true })
  Descripcion?: string;

  @Column({ type: "bit", default: true })
  Activo!: boolean;

  @OneToMany(() => Tarea, (tarea) => tarea.materia)
  tareas!: Tarea[];
}
