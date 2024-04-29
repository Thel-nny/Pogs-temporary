-- migrate:up
CREATE TABLE IF NOT EXISTS carts
(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    pog_id integer REFERENCES pogs(id),
    quantity integer
)
-- migrate:down
DROP TABLE IF EXISTS carts