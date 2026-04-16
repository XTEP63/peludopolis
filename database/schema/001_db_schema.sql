CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'cliente'
        CHECK (role IN ('admin', 'cliente')),
    status VARCHAR(20) NOT NULL DEFAULT 'activo'
        CHECK (status IN ('activo', 'inactivo', 'bloqueado')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    age INT CHECK (age >= 0),
    weight NUMERIC(6,2) CHECK (weight >= 0),
    size VARCHAR(20) NOT NULL
        CHECK (size IN ('pequeno', 'mediano', 'grande')),
    sex VARCHAR(20)
        CHECK (sex IN ('macho', 'hembra')),
    color VARCHAR(50),
    allergies TEXT,
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'activo'
        CHECK (status IN ('activo', 'inactivo')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE rooms (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    pet_type_allowed VARCHAR(20) NOT NULL
        CHECK (pet_type_allowed IN ('perro', 'gato', 'reptil', 'ambos')),
    size_allowed VARCHAR(20) NOT NULL
        CHECK (size_allowed IN ('pequeno', 'mediano', 'grande', 'todos')),
    capacity INT NOT NULL CHECK (capacity > 0),
    price_per_night NUMERIC(10,2) NOT NULL CHECK (price_per_night >= 0),
    description TEXT,
    image_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'disponible'
        CHECK (status IN ('disponible', 'mantenimiento', 'inactiva', 'ocupada')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE services (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    service_type VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'activo'
        CHECK (status IN ('activo', 'inactivo')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reservations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    room_id BIGINT NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    reservation_status VARCHAR(20) NOT NULL DEFAULT 'pendiente'
        CHECK (reservation_status IN ('pendiente', 'confirmada', 'cancelada', 'en_curso', 'finalizada')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_reservation_dates CHECK (end_date > start_date)
);

CREATE TABLE reservation_pets (
    reservation_id BIGINT NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    pet_id BIGINT NOT NULL REFERENCES pets(id) ON DELETE RESTRICT,
    PRIMARY KEY (reservation_id, pet_id)
);

CREATE TABLE reservation_services (
    id BIGSERIAL PRIMARY KEY,
    reservation_id BIGINT NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    CONSTRAINT unique_reservation_service UNIQUE (reservation_id, service_id)
);

CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    reservation_id BIGINT NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    payment_method VARCHAR(30) NOT NULL
        CHECK (payment_method IN ('efectivo', 'transferencia', 'tarjeta')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pendiente'
        CHECK (payment_status IN ('pendiente', 'pagado', 'fallido', 'reembolsado')),
    transaction_reference VARCHAR(120),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE check_movements (
    id BIGSERIAL PRIMARY KEY,
    reservation_id BIGINT NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    movement_type VARCHAR(20) NOT NULL
        CHECK (movement_type IN ('check_in', 'check_out')),
    movement_status VARCHAR(20) NOT NULL DEFAULT 'solicitado'
        CHECK (movement_status IN ('solicitado', 'confirmado', 'cancelado')),
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    notes TEXT
);

CREATE INDEX idx_pets_user_id ON pets(user_id);
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_room_id ON reservations(room_id);
CREATE INDEX idx_reservations_dates ON reservations(start_date, end_date);
CREATE INDEX idx_reservation_services_reservation_id ON reservation_services(reservation_id);
CREATE INDEX idx_payments_reservation_id ON payments(reservation_id);
CREATE INDEX idx_check_movements_reservation_id ON check_movements(reservation_id);