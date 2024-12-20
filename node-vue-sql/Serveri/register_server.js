// server.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3006; // Make sure this matches the Vue.js code

// Middleware to parse JSON and allow cross-origin requests
app.use(express.json());
app.use(cors());

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'computer_test_database',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Register route
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Check if the email already exists in the database
  db.execute('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error checking email in database:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      // If email already exists, return an error
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Insert the user into the database without hashing the password
    db.execute(
      'INSERT INTO users (email, password, idRoles) VALUES (?, ?, ?)',
      [email, password, 2],  // Insert plain text password
      (err, results) => {
        if (err) {
          console.error('Error inserting into database:', err);
          return res.status(500).json({ error: 'Error registering user' });
        }

        // Send success response
        return res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
