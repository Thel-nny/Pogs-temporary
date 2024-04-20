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
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    } else {
      throw new Error('Password is not provided');
    }
    const result = await client.query('INSERT INTO users (firstname, lastname, email, wallet, password, classification) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [firstname, lastname, email, 5000, hashedPassword, classification]);
    client.release();
    console.log('User signed up successfully:', result.rows[0]);
    console.log('Hashed password:', hashedPassword);
    res.json({ message: 'User signed up successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'An error occurred while signing up' });
  }
});

app.get('/:userPogs', async (req, res) => {
  try {
    const client = await pool.connect()
    const userId = req.params
    const result = await client.query('SELECT * FROM pogs INNER JOIN users ON users.pogs_id = pogs.user_id WHERE users.pogs_id = $1;', [userId])
    res.json({ result });
    client.release()
  } catch (error: any) {
    console.error('', error)
  }
})

app.post('/pogsform', async (req, res) => {
  try {
    const client = await pool.connect();
    const { name, ticker_symbol,price, color} = req.body;
    const result = await client.query('INSERT INTO pogs (name, ticker_symbol, price, color) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, ticker_symbol,price, color]);
    client.release();
    console.log('Pogs submitted successfully', result.rows[0]);
    res.json({ message: 'Pogs submitted successfully' });
  } catch (error) {
    console.error('Error creating pog:', error);
    res.status(500).json({ error: 'An error occurred while creating pog' });
  }
});

app.get('/adminSide', async (req, res) => {

})


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT email, password FROM users WHERE email = $1', [email]);
    client.release();
    if (result.rows[0].email !== email) {
      return res.status(400).json({ error: 'User not found' });
    }
    const user = result.rows[0];
    if (!bcrypt.compare(password, result.rows[0].password)) {
      return res.status(400).json({ error: 'Incorrect password' });
    } else {
      res.status(200).json({
        message: 'Login successful',
        user: { id: user.id, email: user.email },
        classification: user.classification
      });
    }

  } catch (error: any) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));