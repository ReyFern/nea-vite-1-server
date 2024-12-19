import mysql from "mysql2";

import express from "express";
import cors from "cors";
import dotenv from 'dotenv';

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
console.log(users);

app.use(cors(corsOptions));

app.get('/api', (req, res) => {
    res.json({"users": ["userOne", "userTwo", "userThree"]});
});

app.listen(5000, () => {
    console.log('server listening on port 5000');
});