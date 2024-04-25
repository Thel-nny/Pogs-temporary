import app from "./index";
import express from "express";
import pogs from "./routes"
import bodyParser from 'body-parser';
import { Pool } from 'pg';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const bcrypt = require('bcrypt');

app.use(bodyParser.json());
app
  .use(express.static(__dirname))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use("/", pogs)
  .use(cookieParser());

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

app.get('/userPogs', async (req, res) => {
  try {
     const { rows } = await pool.query('SELECT * FROM pogs');
     res.json(rows);
  } catch (error) {
     console.error(error);
     res.status(500).json({ message: 'Server error' });
  }
 });
 
app.get('/userPogs/:userId', async (req, res) => {
  try {
    const client = await pool.connect()
    const userId = req.params.userId
    const result = await client.query('SELECT * FROM pogs INNER JOIN users ON users.id = pogs.user_id WHERE pogs.user_id = $1', [userId])
    res.json(result.rows)
    client.release()
  } catch (error: any) {
    console.error('', error)
  }
})

app.get('/showUserPogs/:userId', async (req, res) =>{
  try{
    const client = await pool.connect();
    const userId = req.params.userId
    const result = await client.query('SELECT * FROM pogs WHERE  user_id = $1', [userId])
    res.json(result.rows)
  } catch(error: any) {
    console.log(error)
  }
})
app.get('/getUserDetails/:userId', async(req, res)=> {
  try {
    const client = await pool.connect()
    const userId = req.params.userId
    const result = await client.query('SELECT * FROM users WHERE id = $1', [userId])
    res.json(result.rows)
    client.release()
  } catch(error: any) {
    console.log(error)
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

app.get('/pogs/:id', async (req, res) => {
  try {
     const { rows } = await pool.query('SELECT * FROM pogs WHERE id = $1', [req.params.id]);
     if (!rows.length) {
       return res.status(404).json({ message: 'Pog not found' });
     }
     res.json(rows[0]);
  } catch (error) {
     console.error(error);
     res.status(500).json({ message: 'Server error' });
  }
 });

 app.put('/pogs/:id', async (req, res) => {
  try {
     const { rows } = await pool.query('UPDATE pogs SET price = $1 WHERE id = $2 RETURNING *', 
     [req.body.price, req.params.id]);
     if (!rows.length) {
       return res.status(404).json({ message: 'Pog not found' });
     }
     res.json(rows[0]);
  } catch (error) {
     console.error(error);
     res.status(500).json({ message: 'Server error' });
  }
 });

 app.post('/buyPog', async (req, res) => {
  try {
    const { pogId, userId } = req.body
    const client = await pool.connect();
    const result = await client.query('UPDATE pogs SET user_id = $1 WHERE id = $2',
    [userId, pogId]);
    client.release();
    res.json({ message: 'The Pog has been purchased successfully.' , result});
  } catch (error) {
    console.error('Error creating pog:', error);
    res.status(500).json({ error: 'An error occurred while creating pog' });
  }
})

app.patch('/changePrice', async(req, res) => {
  try {
    const {pogId} = req.query
    const client = await pool.connect()
    const result = await client.query('GET price FROM pogs WHERE id = $1 ', [pogId])
    let randomizer = (Math.random() * 0.1) - 0.05;
    let randomPercentage = randomizer * 100;
    let newPrice = randomPercentage * result.rows[0].price + result.rows[0].price
    const newQuery = await client.query('UPDATE pogs SET price = $1 WHERE pogId = $2', 
    [newPrice, pogId])
    client.release()
    res.json({message: 'The price has been updated', newQuery})
  } catch(error) {
    console.error(error)
  }
})

app.get('/sellPog', async (req, res) => {
  try {
    const { pogId } = req.query;
    const client = await pool.connect();
    const result = await client.query('UPDATE pogs SET user_id = null WHERE id = $1',
    [pogId]);
    client.release();
    res.json({ message: 'The Pog has been sold successfully.', result });
  } catch (error) {
    console.error('Error selling pog:', error);
    res.status(500).json({ error: 'An error occurred while selling pog' });
  }
});

app.get('/pogsForSale', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM pogs WHERE user_id IS NULL')
    res.json(result.rows)
    client.release()
  } catch (error: any) {
    console.error('', error)
  }
})

app.post('/login', async (req, res) => { //fix logic for login
  const { email, password, classification } = req.body;
  try {
     const client = await pool.connect();
     const result = await client.query('SELECT id, email, password, classification FROM users WHERE email = $1', [email]);
     client.release();
     if (result.rows.length === 0) {
       return res.status(400).json({ error: 'User not found' });
     }
     const user = result.rows[0];
     console.log('User data from database:', user);
     if (!await bcrypt.compare(password, user.password)) {
       return res.status(400).json({ error: 'Incorrect password' });
     } else {
       res.status(200).json({
         user: { id: user.id, email: user.email, classification: user.classification }
       });
     }
  } catch (error: any) {
     console.error('Error logging in:', error.message);
     res.status(500).json({ error: 'An error occurred while logging in' });
  }
 });
 

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));