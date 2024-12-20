const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3007;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Fetch all data
app.get('/api/software', (req, res) => {
  const query = `SELECT * FROM software ORDER BY Software_ID ASC`;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(results);
    }
  });
});

// Add a new software
app.post('/api/software', (req, res) => {
  const { Software_Name, Version} = req.body;

  if (!Software_Name || !Version) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO software (Software_Name, Version)
    VALUES (?, ?)
  `;

  db.query(query, [Software_Name, Version], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Database insert failed' });
    } else {
      res.status(201).json({ message: 'Software added successfully', id: results.insertId });
    }
  });
});

// Delete a software
app.delete('/api/software/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM software WHERE Software_ID = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting software:', err);
      res.status(500).json({ error: 'Failed to delete software' });
    } else {
      res.status(200).json({ message: 'Software deleted successfully' });
    }
  });
});

// Update a software record
app.put('/api/software/:id', (req, res) => {
  const { id } = req.params;
  const { Software_Name, Version } = req.body;

  if (!id || !Software_Name || !Version) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    UPDATE software 
    SET Software_Name = ?, Version = ?
    WHERE Software_ID = ?
  `;

  db.query(query, [Software_Name, Version, id], (err, results) => {
    if (err) {
      console.error('Database update error:', err);
      res.status(500).json({ error: 'Database update failed' });
    } else {
      res.status(200).json({ message: 'Update successful', affectedRows: results.affectedRows });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
