import pg from 'pg'
const { Pool } = pg

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Lab3Testing',
  password: 'shawn',
  port: 5433,
});