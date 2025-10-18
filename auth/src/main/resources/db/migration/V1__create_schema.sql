CREATE SCHEMA IF NOT EXISTS authentication;

CREATE TABLE IF NOT EXISTS capitecbank.authentication.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS capitecbank.authentication.user_roles (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES capitecbank.authentication.users(id) ON DELETE CASCADE,
    role_name VARCHAR(50) NOT NULL CHECK (role_name IN ('DISPUTE_ADMIN', 'CUSTOMER'))
);

INSERT INTO capitecbank.authentication.users (username, password, email)
VALUES
    ('admin', 'password1', 'admin@domain.tld'),
    ('customer', 'password1', 'customer@domain.tld');

INSERT INTO capitecbank.authentication.user_roles (user_id, role_name)
SELECT id, 'DISPUTE_ADMIN' FROM capitecbank.authentication.users WHERE username='admin';
INSERT INTO capitecbank.authentication.user_roles (user_id, role_name)
SELECT id, 'CUSTOMER' FROM capitecbank.authentication.users WHERE username='customer';
