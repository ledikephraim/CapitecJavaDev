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

--Disputes

-- Lookup for dispute reasons
CREATE TABLE IF NOT EXISTS capitecbank.transactions.dispute_reason_lookup (
    code VARCHAR(50) PRIMARY KEY,
    description TEXT NOT NULL
);

-- Lookup for dispute statuses
CREATE TABLE IF NOT EXISTS capitecbank.transactions.dispute_status_lookup (
    code VARCHAR(20) PRIMARY KEY,
    description TEXT NOT NULL
);

-- Lookup for dispute event types
CREATE TABLE IF NOT EXISTS capitecbank.transactions.dispute_event_type_lookup (
    code VARCHAR(50) PRIMARY KEY,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS capitecbank.transactions.disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES capitecbank.transactions.transactions(id),
    user_id UUID NOT NULL,
    reason_code VARCHAR(50) NOT NULL REFERENCES capitecbank.transactions.dispute_reason_lookup(code),
    status_code VARCHAR(20) NOT NULL REFERENCES capitecbank.transactions.dispute_status_lookup(code) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS capitecbank.transactions.dispute_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispute_id UUID NOT NULL REFERENCES capitecbank.transactions.disputes(id),
    event_type_code VARCHAR(50) NOT NULL REFERENCES capitecbank.transactions.dispute_event_type_lookup(code),
    event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dispute reasons
INSERT INTO capitecbank.transactions.dispute_reason_lookup (code, description) VALUES
('UNAUTHORIZED', 'Transaction not authorized by the customer'),
('DUPLICATE', 'Duplicate transaction detected'),
('INCORRECT_AMOUNT', 'Incorrect transaction amount'),
('MERCHANT_ERROR', 'Merchant processing error'),
('FRAUD', 'Suspected fraudulent transaction');

-- Dispute statuses
INSERT INTO capitecbank.transactions.dispute_status_lookup (code, description) VALUES
('PENDING', 'Dispute submitted and awaiting review'),
('UNDER_REVIEW', 'Dispute under investigation'),
('RESOLVED', 'Dispute resolved successfully'),
('REJECTED', 'Dispute rejected by bank'),
('CANCELLED', 'Dispute cancelled by customer');

-- Dispute event types
INSERT INTO capitecbank.transactions.dispute_event_type_lookup (code, description) VALUES
('CREATED', 'Dispute record created'),
('STATUS_UPDATED', 'Dispute status updated'),
('COMMENT_ADDED', 'Comment added to dispute'),
('ATTACHMENT_UPLOADED', 'Evidence or attachment uploaded'),
('CLOSED', 'Dispute closed');
