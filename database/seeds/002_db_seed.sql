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