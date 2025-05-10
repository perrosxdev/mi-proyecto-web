CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  employee_id INT UNIQUE REFERENCES employees(id) ON DELETE CASCADE,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'employee'))
);
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL
);
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('entrada', 'salida'))
);
CREATE TABLE vacation_requests (
  id SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reason TEXT
);

-- Empleados
INSERT INTO employees (id, name, position)
VALUES
  (1, 'Juan Pérez', 'Desarrollador'),
  (2, 'María López', 'Diseñadora'),
  (3, 'Carlos García', 'Gerente');

-- Usuarios
INSERT INTO users (employee_id, username, password, role)
VALUES
  (1, 'juan.perez', 'password123', 'employee'),
  (2, 'maria.lopez', 'password123', 'employee'),
  (3, 'carlos.garcia', 'password123', 'employee'),
  (NULL, 'admin', 'admin123', 'admin'); -- Usuario administrador sin relación con empleados

-- Tabla para registrar las horas trabajadas
CREATE TABLE work_hours (
  id SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  total_hours INTERVAL
);

-- Insertar registros de asistencia
INSERT INTO attendance (employee_id, date, time, type)
VALUES
  (1, '2025-05-01', '09:00:00', 'entrada'),
  (1, '2025-05-01', '17:00:00', 'salida'),
  (2, '2025-05-01', '09:15:00', 'entrada'),
  (2, '2025-05-01', '17:10:00', 'salida'),
  (3, '2025-05-01', '08:45:00', 'entrada'),
  (3, '2025-05-01', '16:50:00', 'salida');