import mysql from "mysql2";
import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import fs from "fs";
import bodyParser from 'body-parser';
import crypto from 'crypto';

dotenv.config(); // Configure dotenv and environment variables

const app = express();
const corsOptions = {
    origin: ["http://localhost:5173"]
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create connection pool to MySQL server
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

// Gets all users from user_details table
async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM user_details");
    return rows;
}

// Adds user to the user_details table
function addUser(username, hashed_password, email) {
    pool.query(`INSERT INTO user_details (username, hashed_password, email) VALUES ('${username}', '${hashed_password}', '${email}')`);
}

// Gets user from the user_details table
async function getUser(username, hashed_password) {
    const [rows] = await pool.query(`SELECT * FROM user_details WHERE username='${username}' AND hashed_password='${hashed_password}'`);
    return rows;
}

function writeUser(userData) {
    fs.writeFile("./json/user_info.json", userData, (error) => {
        if (error) {
          console.error(error);
          throw error;
        }
    });
}

function readUser() {
    fs.readFile("./json/user_info.json", (error, data) => {
        // if the reading process failed,
        // throwing the error
        if (error) {
          // logging the error
          console.error(error);
      
          throw err;
        }
        return JSON.parse(data);
    });
}

async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}

// Get all users and write to user_info.json
/*
const users = await getUsers();
const data = JSON.stringify(users[0]);
fs.writeFile("./json/user_info.json", data, (error) => {
    if (error) {
      console.error(error);
      throw error;
    }
});
*/

app.use(cors(corsOptions));

// Read from user_info.json and assign data to variable
/*
fs.readFile("./json/user_info.json", (error, data) => {
    // if the reading process failed,
    // throwing the error
    if (error) {
      // logging the error
      console.error(error);
  
      throw err;
    }
    const users = JSON.parse(data);
});
*/

app.post('/register-request', (req, res) => {
    console.log(req.body); // For testing purposes
    const hashed_password = sha256(req.body.password); // Hash password using SHA256

    hashed_password.then((result) => {
        addUser(req.body.username, result, req.body.email); // Runs INSERT statement to database
    });
    res.send("Successfully posted"); // Confirms POST request
});

app.get('/signin-request', (req, res) => {
    console.log(req.query.username); // For testing purposes
    const hashed_password = sha256(req.query.password); // Hash password using SHA256

    hashed_password.then((result) => {
        const users = getUser(req.query.username, result); // Runs SELECT statement in database
        users.then((userData) => {
            const data = JSON.stringify(userData[0]);
            res.json({auth:"authorised"});
        });
    });
});

// Server listening on port 5000
app.listen(5000, () => {
    console.log('server listening on port 5000');
});