import mysql from "mysql2";
import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import fs from "fs";

dotenv.config();

const app = express();
const corsOptions = {
    origin: ["http://localhost:5173"]
};

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM user_details");
    return rows;
}

const users = await getUsers();
const data = JSON.stringify(users[0]);
fs.writeFile("./json/user_info.json", data, (error) => {
    if (error) {
      console.error(error);
      throw error;
    }
});

app.use(cors(corsOptions));

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
app.get('/api', (req, res) => {
    res.json(users[0]);
});

app.listen(5000, () => {
    console.log('server listening on port 5000');
});