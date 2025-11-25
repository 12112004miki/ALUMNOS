USE InstitutoDB;
GO

-- Tabla Alumnos
CREATE TABLE Alumnos (
    AlumnoId INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Apellido NVARCHAR(100) NOT NULL,
    Correo NVARCHAR(150) UNIQUE NOT NULL,
    FechaRegistro DATETIME2 DEFAULT GETDATE(),
    Activo BIT DEFAULT 1
);
GO

-- Tabla Materias
CREATE TABLE Materias (
    MateriaId INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(120) NOT NULL,
    Descripcion NVARCHAR(255),
    Activo BIT DEFAULT 1
);
GO

-- Tabla Tareas
CREATE TABLE Tareas (
    TareaId INT IDENTITY(1,1) PRIMARY KEY,
    AlumnoId INT NOT NULL,
    MateriaId INT NOT NULL,
    Titulo NVARCHAR(200) NOT NULL,
    Descripcion NVARCHAR(MAX),
    FechaEntrega DATETIME2 NOT NULL,
    Estado NVARCHAR(20) CHECK (Estado IN ('Pendiente', 'Entregada', 'Atrasada')) DEFAULT 'Pendiente',
    FechaCreacion DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Tareas_Alumnos FOREIGN KEY (AlumnoId) REFERENCES Alumnos(AlumnoId),
    CONSTRAINT FK_Tareas_Materias FOREIGN KEY (MateriaId) REFERENCES Materias(MateriaId)
);
GO

-- Índices
CREATE INDEX IX_Tareas_AlumnoId ON Tareas(AlumnoId);
CREATE INDEX IX_Tareas_MateriaId ON Tareas(MateriaId);
GO

-- Seed opcional
INSERT INTO Alumnos (Nombre, Apellido, Correo)
VALUES ('Juan', 'Perez', 'juan.perez@example.com');
GO

INSERT INTO Materias (Nombre, Descripcion)
VALUES ('Matemáticas', 'Cálculo y álgebra');
GO
