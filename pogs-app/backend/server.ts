import app from "./index";
import express from "express";
import pogs from "./routes"
import bodyParser from 'body-parser';
import { Pool } from 'pg';
import cors from 'cors';
const bcrypt = require('bcrypt');

app.use(bodyParser.json());
app
  .use(express.static(__dirname))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use("/", pogs);

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Lab2 (Testing)',
  password: 'shawn',
  port: 5433
});

app.use(cors({ origin: 'http://localhost:3000' }))
app.post('/signup', async (req, res) => {
  try {
    const client = await pool.connect();
    const { firstname, lastname, email, password, classification } = req.body;
    let hashedPassword;
    let wallet = 5000;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    } else {
      throw new Error('Password is not provided');
    }
    const result = await client.query('INSERT INTO users (firstname, lastname, email, password, classification) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [firstname, lastname, email, hashedPassword, classification]);
    client.release();
    console.log('User signed up successfully:', result.rows[0]);
    console.log('Hashed password:', hashedPassword);
    res.json({ message: 'User signed up successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'An error occurred while signing up' });
  }
});

app.get('/userPogs', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT  FROM pogs INNER JOIN users ON users.pogs_id = pogs.user_id WHERE users.pogs_id = $1;')
    client.release()
     
  } catch(error: any) {
    console.error('', error)
  }
})

app.get('/adminSide', async (req, res) => {

})


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    client.release();
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }//figure out login logic for the hashed password
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