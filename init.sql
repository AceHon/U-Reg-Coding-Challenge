-- Create tables
CREATE TABLE currencies (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE rates (
    id SERIAL PRIMARY KEY,
    base_currency_id INT REFERENCES currencies(id),
    target_currency_id INT REFERENCES currencies(id),
    rate DECIMAL(18, 6) NOT NULL,
    effective_date DATE NOT NULL
);

-- Insert seed data - Expanded list of 9 currencies
INSERT INTO currencies (id, code, name) VALUES
(1, 'USD', 'US Dollar'),
(2, 'EUR', 'Euro'),
(3, 'GBP', 'British Pound'),
(4, 'JPY', 'Japanese Yen'),
(5, 'AUD', 'Australian Dollar'),
(6, 'CAD', 'Canadian Dollar'),
(7, 'CHF', 'Swiss Franc'),
(8, 'CNY', 'Chinese Yuan'),
(9, 'NZD', 'New Zealand Dollar');

-- Insert rates for today (CURRENT_DATE)
INSERT INTO rates (id, base_currency_id, target_currency_id, rate, effective_date) VALUES
-- USD as base currency
(DEFAULT, 1, 2, 0.85, CURRENT_DATE),
(DEFAULT, 1, 3, 0.73, CURRENT_DATE),
(DEFAULT, 1, 4, 110.25, CURRENT_DATE),
(DEFAULT, 1, 5, 1.35, CURRENT_DATE),
(DEFAULT, 1, 6, 1.25, CURRENT_DATE),
(DEFAULT, 1, 7, 0.92, CURRENT_DATE),
(DEFAULT, 1, 8, 7.25, CURRENT_DATE),
(DEFAULT, 1, 9, 1.55, CURRENT_DATE),

-- EUR as base currency
(DEFAULT, 2, 1, 1.18, CURRENT_DATE),
(DEFAULT, 2, 3, 0.86, CURRENT_DATE),
(DEFAULT, 2, 4, 129.71, CURRENT_DATE),
(DEFAULT, 2, 5, 1.59, CURRENT_DATE),
(DEFAULT, 2, 6, 1.47, CURRENT_DATE),
(DEFAULT, 2, 7, 0.97, CURRENT_DATE),
(DEFAULT, 2, 8, 7.65, CURRENT_DATE),
(DEFAULT, 2, 9, 1.82, CURRENT_DATE),

-- GBP as base currency
(DEFAULT, 3, 1, 1.37, CURRENT_DATE),
(DEFAULT, 3, 2, 1.16, CURRENT_DATE),
(DEFAULT, 3, 4, 150.83, CURRENT_DATE),
(DEFAULT, 3, 5, 1.85, CURRENT_DATE),
(DEFAULT, 3, 6, 1.71, CURRENT_DATE),
(DEFAULT, 3, 7, 1.13, CURRENT_DATE),
(DEFAULT, 3, 8, 8.90, CURRENT_DATE),
(DEFAULT, 3, 9, 2.12, CURRENT_DATE);

-- Insert historical rates (same date as before)
INSERT INTO rates (id, base_currency_id, target_currency_id, rate, effective_date) VALUES
(DEFAULT, 1, 2, 0.81, '2023-07-01'),
(DEFAULT, 1, 3, 0.68, '2023-07-01'),
(DEFAULT, 1, 4, 109.31, '2023-07-01'),
(DEFAULT, 1, 5, 1.25, '2023-07-01'),
(DEFAULT, 2, 1, 1.23, '2023-07-01'),
(DEFAULT, 2, 3, 0.83, '2023-07-01'),
(DEFAULT, 2, 4, 132.50, '2023-07-01'),
(DEFAULT, 2, 5, 1.52, '2023-07-01');