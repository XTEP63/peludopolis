INSERT INTO rooms (name, pet_type_allowed, size_allowed, capacity, price_per_night, description, image_url, status)
VALUES
  ('Habitación Jardín', 'perro', 'mediano', 2, 350.00, 'Habitación cómoda con área verde cercana.', 'https://placehold.co/600x400', 'disponible'),
  ('Suite Felina', 'gato', 'pequeno', 1, 280.00, 'Espacio tranquilo para gatos.', 'https://placehold.co/600x400', 'disponible'),
  ('Habitación Familiar', 'ambos', 'todos', 3, 480.00, 'Habitación amplia para varias mascotas.', 'https://placehold.co/600x400', 'disponible');

INSERT INTO services (name, description, price, service_type, status)
VALUES
  ('Baño', 'Servicio de baño básico para mascota.', 120.00, 'higiene', 'activo'),
  ('Corte de uñas', 'Recorte seguro de uñas.', 80.00, 'higiene', 'activo'),
  ('Paseo adicional', 'Paseo extra de 30 minutos.', 100.00, 'actividad', 'activo');

INSERT INTO users (username,email,password_hash,first_name,last_name,phone,address,role,status,created_at)
VALUES
  ('admin01', 'admin@test.com', 'hashed_password', 'Admin', 'Principal', '5512345678', 'Guadalajara', 'admin', 'activo', NOW()),
  ('user01', 'user@test.com', 'hashed_password', 'Juan', 'Perez', '5587654321', 'Zapopan', 'cliente', 'activo', NOW());

INSERT INTO pets (user_id, name, species, breed, age, weight, size, sex, color, allergies, notes, status)
VALUES
  (1,'Max','perro','Labrador',3,28.50,'grande','macho','dorado',NULL,'Muy activo y juguetón','activo'),
  (2,'Luna','gato','Siames',2,4.20,'pequeno','hembra','gris',NULL,'Le gusta dormir mucho','activo'),
  (2,'Rocky','perro','Bulldog',5,22.00,'mediano','macho','blanco','polvo','Necesita dieta especial','activo');