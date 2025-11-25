import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Tarea } from "./Tarea";

@Entity({ name: "Alumnos" })
export class Alumno {
  @PrimaryGeneratedColumn()
  AlumnoId!: number;

  @Column({ type: "nvarchar", length: 100 })
  Nombre!: string;

  @Column({ type: "nvarchar", length: 100 })
  Apellido!: string;

  @Column({ type: "nvarchar", length: 150, unique: true })
  Correo!: string;

  @Column({ type: "datetime2", default: () => "GETDATE()" })
  FechaRegistro!: Date;

  @Column({ type: "bit", default: true })
  Activo!: boolean;

  @OneToMany(() => Tarea, (tarea) => tarea.alumno)
  tareas!: Tarea[];
}
