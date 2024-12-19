import mysql from "mysql2";

import express from "express";
import cors from "cors";

const app = express();
const corsOptions = {
    origin: ["http://localhost:5173"]
};

const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "Davian/75",
    database: "nea_test"
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