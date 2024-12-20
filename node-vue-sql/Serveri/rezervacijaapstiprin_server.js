const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3009;

app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to the database");
});

// Fetch all pieteikumi
app.get("/api/pieteikumi", (req, res) => {
  const query = "SELECT * FROM pieteikums"; // Filter only pending status
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching pieteikumi:", err);
      res.status(500).json({ error: "Error fetching pieteikumi" });
    } else {
      res.json(results);
    }
  });
});


app.put("/api/pieteikumi/:id/status", (req, res) => {
  const { id } = req.params; // Reservation ID from the URL
  const { status } = req.body; // Status passed in the body

  // Check if status is provided
  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  // Check if the reservation ID exists in the database
  const checkQuery = "SELECT * FROM pieteikums WHERE pieteikuma_id = ?";
  db.query(checkQuery, [id], (checkErr, checkResults) => {
    if (checkErr) {
      console.error("Error checking reservation existence:", checkErr.message);
      return res.status(500).json({ error: "Database error checking reservation" });
    }

    if (checkResults.length === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Proceed to update the status of the reservation
    const updateQuery = "UPDATE pieteikums SET status = ? WHERE pieteikuma_id = ?";
    db.query(updateQuery, [status, id], (err, results) => {
      if (err) {
        console.error("Error updating status:", err.message);
        console.error("Stack trace:", err.stack);
        return res.status(500).json({ error: "Error updating status" });
      }

      // Return success message if the update was successful
      res.status(200).json({ message: "Status updated successfully", updated: results.affectedRows });
    });
  });
});


// Add a new rezervacija
app.post("/api/rezervacijas", (req, res) => {
  const { pieteikuma_id, Computer_id, start_time, end_time } = req.body;

  // Validate required fields
  if (!pieteikuma_id || !Computer_id || !start_time || !end_time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Log the incoming request body for debugging
  console.log("Received data for new reservation:", req.body);

  const query = `
    INSERT INTO rezervacija (pieteikuma_id, Computer_id, start_time, end_time)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [pieteikuma_id, Computer_id, start_time, end_time], (err, results) => {
    if (err) {
      // Log the error message and stack trace
      console.error("Error adding rezervacija:", err.message);
      console.error("Stack trace:", err.stack);
      return res.status(500).json({ error: "Error adding rezervacija" });
    }

    res.status(201).json({ message: "Rezervacija added successfully", id: results.insertId });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
