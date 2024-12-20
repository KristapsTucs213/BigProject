const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3003;

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
app.get('/api/data', (req, res) => {
  const query = `SELECT * FROM computer ORDER BY Computer_ID ASC`;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(results);
    }
  });
});


// Add a new computer
app.post('/api/data', (req, res) => {
  const { PC_Name, Operating_System, Rinda, Colona } = req.body;

  if (!PC_Name || !Operating_System || Rinda === undefined || Colona === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO computer (PC_Name, Operating_System, Rinda, Colona)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [PC_Name, Operating_System, Rinda, Colona], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Database insert failed' });
    } else {
      res.status(201).json({ message: 'Computer added successfully', id: results.insertId });
    }
  });
});


// Delete a computer
app.delete('/api/data/:id', (req, res) => {
  const { id } = req.params; // Extract ID from URL
  const query = `DELETE FROM computer WHERE Computer_ID = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting computer:', err);
      res.status(500).json({ error: 'Failed to delete computer' });
    } else {
      res.status(200).json({ message: 'Computer deleted successfully' });
    }
  });
});



// Update a record
app.put('/api/data/:id', (req, res) => {
  const { id } = req.params; // Extract ID from URL
  const { PC_Name, Operating_System, Rinda, Colona } = req.body; // Extract fields from request body

  if (!id || !PC_Name || !Operating_System || Rinda === undefined || Colona === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    UPDATE computer 
    SET PC_Name = ?, Operating_System = ?, Rinda = ?, Colona = ?
    WHERE Computer_ID = ?
  `;

  db.query(query, [PC_Name, Operating_System, Rinda, Colona, id], (err, results) => {
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
