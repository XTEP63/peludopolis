INSERT INTO services (name, description, price, service_type, status)
VALUES
  ('Baño', 'Servicio de baño básico para mascota.', 120.00, 'higiene', 'activo'),
  ('Corte de uñas', 'Recorte seguro de uñas.', 80.00, 'higiene', 'activo'),
  ('Paseo adicional', 'Paseo extra de 30 minutos.', 100.00, 'actividad', 'inactivo');

INSERT INTO users (username,email,password_hash,first_name,last_name,phone,address,role,status,created_at)
VALUES
  ('admin01', 'admin@test.com', 'hashed_password', 'Admin', 'Principal', '5512345678', 'Guadalajara', 'admin', 'activo', NOW()),
  ('user01', 'user@test.com', 'hashed_password', 'Juan', 'Perez', '5587654321', 'Zapopan', 'cliente', 'activo', NOW());

INSERT INTO pets (user_id, name, species, breed, age, weight, size, sex, color, allergies, notes, status)
VALUES
  (1,'Max','perro','Labrador',3,28.50,'grande','macho','dorado',NULL,'Muy activo y juguetón','activo'),
  (2,'Luna','gato','Siames',2,4.20,'pequeno','hembra','gris',NULL,'Le gusta dormir mucho','activo'),
  (2,'Rocky','perro','Bulldog',5,22.00,'mediano','macho','blanco','polvo','Necesita dieta especial','activo');

INSERT INTO rooms (name, pet_type_allowed, size_allowed, capacity, price_per_night, description, image_url, status) 
VALUES
('Suite Mini Dog',    'perro', 'pequeno', 1, 350.00,  'Perfecto para perros pequeños y tranquilos. Hasta 10kg.',       '../../src/assets/SMD.jpg',  'disponible'),
('Suite Dog Comfort', 'perro', 'mediano', 1, 550.00,  'Ideal para perros activos. Entre 10kg y 25kg.',                  '../../src/assets/SDC.jpg',  'disponible'),
('Suite Felina',      'gato',  'pequeno', 1, 400.00,  'Espacio tranquilo para gatos. Arenero incluido.',                '../../src/assets/SF.png',   'disponible'),
('Suite Interestelar','ambos', 'mediano', 2, 850.00,  'Decoración espacial con luces LED. Proyector incluido.',         '../../src/assets/INT.jpeg', 'disponible'),
('Jardín Zen',        'ambos', 'pequeno', 2, 650.00,  'Ambiente relajante. Música relajante incluida.',                 '../../src/assets/ZEN.jpg',  'disponible'),
('Castillo Medieval', 'perro', 'grande',  2, 1000.00, 'Decoración de castillo. Fotografía incluida.',                   '../../src/assets/CM.jpg',   'disponible'),
('Bosque Encantado',  'perro', 'mediano', 3, 700.00,  'Temática de naturaleza. Área de exploración incluida.',          '../../src/assets/BE.jpg',   'disponible'),
('Penthouse VIP',     'perro', 'grande',  5, 1200.00, 'Máximo lujo. Mayordomo incluido.',                               '../../src/assets/PTH.jpg',  'disponible'),
('Terrario Exótico',  'reptil','mediano', 4, 900.00,  'Clima controlado. Control de temperatura incluido.',             '../../src/assets/ter.jpg',  'disponible');

INSERT INTO reservations (user_id, room_id, start_date, end_date, total, reservation_status, notes) VALUES
(2, 1, '2025-03-01', '2025-03-04', 1050.00, 'finalizada',  'Primera estancia de Luna'),
(2, 3, '2025-03-15', '2025-03-18', 1200.00, 'finalizada',  NULL),
(1, 6, '2025-04-01', '2025-04-05', 4000.00, 'finalizada',  'Estancia de prueba del admin'),
(2, 2, '2025-04-10', '2025-04-13', 1650.00, 'cancelada',   'Canceló por enfermedad'),
(2, 5, '2025-05-01', '2025-05-04', 1950.00, 'finalizada',  'Rocky y Luna juntos'),
(1, 4, '2025-05-20', '2025-05-23', 2550.00, 'finalizada',  NULL),
(2, 1, '2025-06-01', '2025-06-03', 700.00,  'confirmada',  'Solo Luna este fin de semana'),
(1, 6, '2025-06-15', '2025-06-18', 3000.00, 'confirmada',  'Incluye servicio de baño'),
(2, 2, '2025-06-28', '2025-07-01', 1650.00, 'pendiente',   NULL),
(2, 4, '2025-07-10', '2025-07-14', 3400.00, 'en_curso',    'Max y Rocky, dieta especial Rocky');

INSERT INTO reservation_pets (reservation_id, pet_id) VALUES
(1,  2),     
(2,  2),  
(3,  1),      
(4,  3),      
(5,  2),      
(5,  3),      
(6,  1),      
(7,  2),     
(8,  1),      
(9,  3),      
(10, 1),      
(10, 3);

INSERT INTO reservation_services (reservation_id, service_id, quantity, unit_price, subtotal) VALUES
(1,  1, 1, 120.00, 120.00),   
(2,  2, 1,  80.00,  80.00), 
(3,  1, 1, 120.00, 120.00),  
(3,  2, 1,  80.00,  80.00),  
(5,  1, 2, 120.00, 240.00),   
(6,  1, 1, 120.00, 120.00),  
(8,  1, 1, 120.00, 120.00),   
(10, 1, 2, 120.00, 240.00),   
(10, 2, 1,  80.00,  80.00); 

INSERT INTO payments (reservation_id, amount, payment_method, payment_status, transaction_reference, paid_at) VALUES
(1,  1050.00, 'tarjeta',       'pagado',      'TXN-250301-001', '2025-03-01 10:00:00+00'),
(2,  1200.00, 'transferencia', 'pagado',      'TXN-250315-002', '2025-03-15 09:30:00+00'),
(3,  4000.00, 'tarjeta',       'pagado',      'TXN-250401-003', '2025-04-01 11:00:00+00'),
(4,  1650.00, 'tarjeta',       'reembolsado', 'TXN-250410-004', '2025-04-10 08:00:00+00'),
(5,  1950.00, 'efectivo',      'pagado',       NULL,            '2025-05-01 12:00:00+00'),
(6,  2550.00, 'transferencia', 'pagado',      'TXN-250520-006', '2025-05-20 09:00:00+00'),
(7,   700.00, 'tarjeta',       'pagado',      'TXN-250601-007', '2025-06-01 10:30:00+00'),
(8,  3000.00, 'transferencia', 'pagado',      'TXN-250615-008', '2025-06-15 08:45:00+00'),
(9,  1650.00, 'efectivo',      'pendiente',    NULL,            NULL),
(10, 3400.00, 'tarjeta',       'pagado',      'TXN-250710-010', '2025-07-10 09:15:00+00');