import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Alumno } from "./Alumno";
import { Materia } from "./Materia";

@Entity({ name: "Tareas" })
export class Tarea {
  @PrimaryGeneratedColumn()
  TareaId!: number;

  @Column()
  AlumnoId!: number;

  @Column()
  MateriaId!: number;

  @Column({ type: "nvarchar", length: 200 })
  Titulo!: string;

  @Column({ type: "nvarchar", nullable: true })
  Descripcion?: string;

  @Column({ type: "datetime2" })
  FechaEntrega!: Date;

  @Column({ type: "nvarchar", length: 20, default: "Pendiente" })
  Estado!: string; // Validar en servicio si hace falta

  @Column({ type: "datetime2", default: () => "GETDATE()" })
  FechaCreacion!: Date;

  @ManyToOne(() => Alumno, (alumno) => alumno.tareas, { onDelete: "CASCADE" })
  @JoinColumn({ name: "AlumnoId" })
  alumno!: Alumno;

  @ManyToOne(() => Materia, (materia) => materia.tareas, { onDelete: "CASCADE" })
  @JoinColumn({ name: "MateriaId" })
  materia!: Materia;
}
