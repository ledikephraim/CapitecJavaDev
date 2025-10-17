CREATE SCHEMA IF NOT EXISTS transactions;

CREATE TABLE IF NOT EXISTS capitecbank.transactions.transaction_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS capitecbank.transactions.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    transaction_type_id INT NOT NULL REFERENCES capitecbank.transactions.transaction_types(id),
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'ZAR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO capitecbank.transactions.transaction_types (type_name)
VALUES
    ('DEBIT'),
    ('CREDIT'),
    ('TRANSFER'),
    ('PAYMENT')
ON CONFLICT (type_name) DO NOTHING;