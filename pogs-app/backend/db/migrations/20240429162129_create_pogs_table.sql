-- migrate:up

CREATE TABLE IF NOT EXISTS pogs
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    ticker_symbol VARCHAR(255),
    price integer,
    color VARCHAR(255),
    previous_price numeric,
    user_id integer
)

-- migrate:down

