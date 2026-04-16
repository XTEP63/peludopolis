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