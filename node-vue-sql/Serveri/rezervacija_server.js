const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app = express();
const port = 3004;


app.use(bodyParser.json());
app.use(cors());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '1234', 
  database: 'computer_test_database' 
});


db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});


app.post('/create-reservation', (req, res) => {
  const { Computers, start_time, end_time, first_name, last_name, phone, email, status, Created_at } = req.body;

  
  const query = `
    INSERT INTO pieteikums (Computers, start_time, end_time, first_name, last_name, phone, email, status, Created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, DEFAULT, curdate())
  `;

  db.query(query, [Computers, start_time, end_time, first_name, last_name, phone, email, status, Created_at], (err, result) => {
    if (err) {
      console.error('Error inserting reservation:', err);
      return res.status(500).json({ message: 'Error creating reservation' });
    }

    res.status(200).json({ message: 'Reservation created successfully!', reservationId: result.insertId });
  });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
