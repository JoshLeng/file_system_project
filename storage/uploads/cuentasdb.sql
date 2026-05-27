-- para que no haya problema con los otros docuementos nombrados cuentasdb
DROP DATABASE IF EXISTS cuentasdb;
DROP USER IF EXISTS 'userventadsb'@'localhost';

CREATE DATABASE cuentasdb;
USE cuentasdb;

CREATE USER 'userventadsb'@'localhost' IDENTIFIED BY 'Us3rprogra2025';
GRANT ALL PRIVILEGES ON cuentasdb.* TO 'userventadsb'@'localhost';
FLUSH PRIVILEGES;


-- creacion de tablas

CREATE TABLE CuentasBancarias (
    id_cuenta INT AUTO_INCREMENT PRIMARY KEY,
    numero_cuenta VARCHAR(20) NOT NULL UNIQUE,
    usuario VARCHAR(100) NOT NULL,
    dpi varchar (20),
    telefono varchar(8),
    gmail varchar(30),
    direccion varchar(30),
    estado_de_cuenta DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    estado ENUM("activa","desactivada") NOT NULL
);

CREATE TABLE Movimientos (
    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_cuenta INT NOT NULL,
    usuario varchar(100),
    fecha_movimiento DATETIME NOT NULL,
    tipo_movimiento ENUM('Deposito','Retiro','Transferencia') NOT NULL,
	-- acá se agregará el monto en el punto de alterar una tabla
    FOREIGN KEY (id_cuenta) REFERENCES CuentasBancarias(id_cuenta)
);


-- alteración de 2 tablas
-- en cuentas bancarias se agregará el campo fecha de creación
ALTER TABLE CuentasBancarias 
    ADD COLUMN fecha_creacion DATE NOT NULL DEFAULT (CURRENT_DATE);
-- y en la tabla movimientos se agregará el campo monto
ALTER TABLE Movimientos 
    ADD COLUMN monto DECIMAL(12,2) NOT NULL DEFAULT 0.00;
    
-- Inseción de datos para prueba
INSERT INTO CuentasBancarias (numero_cuenta, usuario, dpi, telefono, gmail, direccion, estado_de_cuenta, estado, fecha_creacion)
VALUES 
('1001','Marta Sandoval','1234567890101','5551234','marta@gmail.com','Zona 1','2500.00','activa','2023-01-15'),
('1002','María López','1234567890102','5552345','maria@gmail.com','Zona 2','1800.50','activa','2023-02-10'),
('1003','Carlos Gómez','1234567890103','5553456','carlos@gmail.com','Zona 3','3200.75','activa','2023-03-20'),
('1004','Antony Contreras','1234567890104','5554567','antony@gmail.com','Zona 4','500.00','activa','2023-04-05'),
('1005','Mario Ramírez','1234567890105','5555678','mario@gmail.com','Zona 5','750.00','desactivada','2023-05-18'),
('1006','Sofía Morales','1234567890106','5556789','sofia@gmail.com','Zona 6','920.25','activa','2023-06-22'),
('1007','Pedro Sanches','1234567890107','5557890','pedro@gmail.com','Zona 7','1200.00','activa','2023-07-30');

INSERT INTO Movimientos (id_cuenta, fecha_movimiento, tipo_movimiento, monto)
VALUES
(1,'2023-08-01 10:30:00','Deposito',500.00),
(1,'2023-08-02 12:15:00','Retiro',200.00),
(2,'2023-08-03 09:45:00','Deposito',1000.00),
(3,'2023-08-04 14:00:00','Retiro',500.00),
(4,'2023-08-05 16:20:00','Transferencia',300.00),
(5,'2023-08-06 11:00:00','Deposito',400.00),
(6,'2023-08-07 18:10:00','Retiro',150.00);	

-- actualización de alunos registros

-- ///	actualizaciones
-- En cuentas: aumentar saldo a marta
UPDATE CuentasBancarias 
SET estado_de_cuenta = estado_de_cuenta + 1000 
WHERE id_cuenta = 1;

-- En cuentas: cambiar estado de mario a activa
UPDATE CuentasBancarias 
SET estado = 'activa' 
WHERE id_cuenta = 5;

-- //eliminaciones

DELETE FROM Movimientos WHERE id_movimiento = 2;


-- /////SELECT PARA UNIR AMBAS TABLAS
SELECT 
    c.id_cuenta, 
    c.usuario, 
    c.numero_cuenta, 
    c.estado_de_cuenta, 
    m.id_movimiento, 
    m.fecha_movimiento, 
    m.tipo_movimiento, 
    m.monto
FROM CuentasBancarias c
INNER JOIN Movimientos m ON c.id_cuenta = m.id_cuenta
ORDER BY c.id_cuenta, m.fecha_movimiento;



