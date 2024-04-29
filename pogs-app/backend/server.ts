// import app from "./index";
import express from "express";
import pogs from "./routes"
import bodyParser from 'body-parser';
import { pool } from "./poolInstance";
import cors from 'cors';
import cookieParser from 'cookie-parser';

const bcrypt = require('bcrypt');
export const app = express();

app.use(bodyParser.json());
app
  .use(express.static(__dirname))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use("/", pogs)
  .use(cookieParser());



app.use(cors({ origin: 'http://localhost:3000' }))

app.post('/signup', async (req, res) => {
  try {
    const client = await pool.connect();
    const { firstname, lastname, email, password, classification } = req.body;
    let hashedPassword: string;
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
    return res.status(200).json({ message: 'User signed up successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'An error occurred while signing up' });
  }
});

app.post('/login', async (req, res) => { //fix logic for login
  const { email, password } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT id, email, password, classification FROM users WHERE email = $1', [email]);
    client.release();
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }
    if (result.rows.length > 1) {
      return res.status(400).json({ error: 'Duplicate email detected.' })
    }
    const user = result.rows[0];
    console.log('User data from database:', user);
    if (!await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ error: 'Incorrect password' });
    } else {
      return res.status(200).json({
        user: { id: user.id, email: user.email, classification: user.classification }
      });
    }
  } catch (error: any) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
});

app.post('/pogsform', async (req, res) => {
  try {
    const client = await pool.connect();
    const { name, ticker_symbol, price, color } = req.body;
    const result = await client.query('INSERT INTO pogs (name, ticker_symbol, price, color, previous_price) VALUES ($1, $2, $3, $4, 0) RETURNING *',
      [name, ticker_symbol, price, color]);
    client.release();
    console.log('Pogs submitted successfully', result.rows[0]);
    return res.status(200).json({ message: 'Pogs submitted successfully' });
  } catch (error) {
    console.error('Error creating pog:', error);
    res.status(500).json({ error: 'An error occurred while creating pog' });
  }
});

app.patch('/changePrice', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM pogs');
    const pogPrices = result.rows;
    await Promise.all(pogPrices.map(async (pog) => {
      let randomizer = (Math.random() * 0.1) - 0.05;
      let randomPercentage = randomizer * 100;
      let newPrice = Math.round(pog.price * (1 + (randomPercentage / 100)));
      await client.query('UPDATE pogs SET previous_price = $1 WHERE id = $2', [pog.price, pog.id]);
      await client.query('UPDATE pogs SET price = $1 WHERE id = $2', [newPrice, pog.id]);
    }));

    client.release();
    return res.json({ message: 'The prices have been updated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while updating prices' });
  }
});


app.delete('/adminSide/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    const result = await client.query('DELETE FROM pogs WHERE id = $1 RETURNING *', [id]);
    client.release();
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: 'Pog not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error });
  }
});

app.get('/userPogs', async (req, res) => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM pogs');
    client.release();
    console.log(rows)
    return res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/getUserDetails/:userId', async (req, res) => {
  try {
     const client = await pool.connect();
     const userId = req.params.userId;
     const result = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
     client.release();
     if (result.rows.length > 0) {
       return res.json(result.rows);
     } else {
       return res.status(404).json({ message: 'User not found' });
     }
  } catch (error) {
     console.error('Error fetching user details:', error);
     return res.status(500).json({ message: 'Server error' });
  }
 });

app.get('/showUserPogs/:userId', async (req, res) => {
  try {
    const client = await pool.connect();
    const userId = req.params.userId
    const result = await client.query(`
    SELECT pogs.id, pogs.name, pogs.ticker_symbol, pogs.price, 
    pogs.color, pogs.previous_price, carts.quantity
    FROM carts INNER JOIN pogs ON carts.pog_id = pogs.id
    WHERE carts.user_id = $1`, [userId])
    client.release()
    return res.json(result.rows)
  } catch (error: any) {
    console.log(error)
  }
})

app.put('/editPogs/:id', async (req, res) => {
  const { id, name, ticker_symbol, color } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      `UPDATE pogs SET name = $1, ticker_symbol = 
        $2, color = $3 WHERE id = $4`,
      [name, ticker_symbol, color, id]
    );
    console.log(result.rows)
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/sellPog', async (req, res) => {
  try {
    const { user_id, pogs_id, quantity } = req.body
    const client = await pool.connect()
    const user = await client.query('SELECT * FROM users WHERE id = $1', [user_id])
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' })
    }
    const pog = await client.query('SELECT * FROM pogs WHERE id = $1', [pogs_id])
    if (pog.rows.length === 0) {
      return res.status(404).json({ error: 'Pog not found.' })
    }
    const cart = await client.query('SELECT * FROM carts WHERE user_id = $1 AND pog_id = $2', [user_id, pogs_id])
    const newQuantity = cart.rows[0].quantity - quantity
    const newBalance = Number(user.rows[0].wallet) + Number(pog.rows[0].price * quantity)
    if (cart.rows[0].quantity <= 1) {
      await client.query('DELETE FROM carts WHERE user_id = $1 AND pog_id = $2', [user_id, pogs_id])
      console.log("New Balance: " + newBalance)
      await client.query('UPDATE users SET wallet = $1 WHERE id = $2', [newBalance, user_id])
      return res.status(200).json({ message: 'Pog removed due to quantity reaching 0.', removed: true });
    }
    const update = await client.query('UPDATE carts SET quantity = $1 WHERE user_id = $2 AND pog_id = $3 RETURNING *', [newQuantity, user_id, pogs_id])
    console.log("New Balance: " + newBalance)
    await client.query('UPDATE users SET wallet = $1 WHERE id = $2', [newBalance, user_id])
    return res.status(201).json(update.rows)
  } catch (error) {
    console.error(error)
  }
});

app.get('/pogsForSale', async (req, res) => { //shows pogs for sale on user side
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM pogs')
    client.release()
    return res.json(result.rows)
  } catch (error: any) {
    console.error('', error)
  }
})


app.post('/buyPogs', async (req, res) => {
  try {
    const { user_id, pogs_id, quantity } = req.body
    const client = await pool.connect()
    const user = await client.query('SELECT * FROM users WHERE id = $1', [user_id])
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' })
    }
    const pog = await client.query('SELECT * FROM pogs WHERE id = $1', [pogs_id])
    if (pog.rows.length === 0) {
      return res.status(404).json({ error: 'Pog not found.' })
    }
    const totalCost = pog.rows[0].price * quantity
    if (totalCost > user.rows[0].wallet) {
      return res.status(400).send({ error: 'Insufficient Balance' })
    }
    const cart = await client.query('SELECT * FROM carts WHERE user_id = $1 AND pog_id = $2', [user_id, pogs_id])
    if (cart.rows.length === 0) {
      const newBalance = Number(user.rows[0].wallet - (pog.rows[0].price * quantity))
      const insert = await client.query('INSERT INTO carts (user_id, pog_id, quantity) VALUES($1, $2, $3) RETURNING *', [user_id, pogs_id, quantity])
      await client.query('UPDATE users SET wallet = $1 WHERE id = $2', [newBalance, user_id])
      return res.status(201).json(insert.rows)
    } else {
      const newQuantity = cart.rows[0].quantity + quantity
      const update = await client.query('UPDATE carts SET quantity = $1 WHERE user_id = $2 AND pog_id = $3 RETURNING *', [newQuantity, user_id, pogs_id])
      const newBalance = Number(user.rows[0].wallet - (pog.rows[0].price * quantity))
      await client.query('UPDATE users SET wallet = $1 WHERE id = $2', [newBalance, user_id])
      return res.status(201).json(update.rows)
    } //another if else statement na di siya pwede ka buy pogs if iya money is kulang
  } catch (error) {
    console.error(error)
  }
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
// export default app;