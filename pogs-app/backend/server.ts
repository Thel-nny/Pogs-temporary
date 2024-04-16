import app from "./index";
import express from "express";
import pogs from "./routes"
import bodyParser from 'body-parser';
import { Pool } from 'pg';
import cors from 'cors';
app.use(bodyParser.json());
app
 .use(express.static(__dirname))
 .use(express.json())
 .use(express.urlencoded({extended: true}))
 .use("/", pogs);

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Lab2 (Testing)',
    password: 'shawn',
    port: 5433
  });

app.use(cors({ origin: 'http://localhost:3000' }))
app.post('/signup', async(req, res) => {
    const { firstname, lastname, email, password } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *', 
    [firstname, lastname, email, password]);
    client.release();
    console.log('User signed up successfully:', result.rows[0]);
    res.json({ message: 'User signed up successfully' });
  } catch (error: any) {
    console.error('Error signing up:', error.message);
    res.status(500).json({ error: 'An error occurred while signing up' });
  }
 });


 app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      client.release();
      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'User not found' });
      }
      const user = result.rows[0];
      if (user.password !== password) {
        return res.status(400).json({ error: 'Incorrect password' });
      }
      res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email } });
    } catch (error: any) {
      console.error('Error logging in:', error.message);
      res.status(500).json({ error: 'An error occurred while logging in' });
    }
  });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
