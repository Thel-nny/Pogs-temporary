-- migrate:up
CREATE TABLE IF NOT EXISTS users
(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    wallet numeric,
    classification VARCHAR(255),
    pogs_id numeric
)

-- migrate:down

