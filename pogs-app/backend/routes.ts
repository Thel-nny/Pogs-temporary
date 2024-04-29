import * as express from 'express';
import { Request, Response } from 'express';
import { pool } from './poolInstance';
import { urlencoded } from "body-parser";
import dotenv from 'dotenv';

const router = express.Router();
dotenv.config();

router.use(urlencoded({ extended: true }))
router.post('/pogs', async (req: Request, res: Response) => {
  try {
    const { name, ticker_symbol, price, color } = req.body
    if (name && ticker_symbol && price && color) {
      const connect = await pool.connect()
      const query = await connect.query('INSERT INTO pogs (name, ticker_symbol, price, color) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, ticker_symbol, price, color])
      connect.release();
      res.status(201).json(query.rows);
    } else {
      res.status(422).json({ error: 422 });
    }
  } catch (err) {
    console.error(err)
    res.status(500).send('Internal Server Error');
  }
})


router.get('/pogs', async (req: Request, res: Response) => {
  try {
    const connect = await pool.connect()
    const result = await connect.query('SELECT * FROM pogs');
    connect.release();
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/pogs/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connect = await pool.connect()
    const result = await connect.query('SELECT * FROM pogs WHERE id = $1', [id])
    connect.release();
    if (result.rows.length !== 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).send(404)
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/pogs/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, ticker_symbol, price, color } = req.body;
    const connect = await pool.connect();

    // Prepare the update statement
    const query = `UPDATE pogs SET name = $1, ticker_symbol = $2,
          price = $3, color = $4 WHERE id = $5 RETURNING *`;
    const values = [name, ticker_symbol, price, color, id];

    const result = await connect.query(query, values);
    connect.release();

    // Check if rowCount is not null before using it
    if (result.rowCount !== null && result.rowCount > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).send('Record not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/pogs/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connect = await pool.connect();
    const query = 'DELETE FROM pogs WHERE id = $1';
    const values = [id];
    const result = await connect.query(query, values);
    connect.release();
    if (result.rowCount !== null && result.rowCount > 0) {
      res.status(200).json({ message: 'Record deleted' });
    } else {
      res.status(404).send('Record not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
}
)

export default router;