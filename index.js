const express = require('express');
const app = express();
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"]
};

app.use(cors(corsOptions));

app.get('/api', (req, res) => {
    res.json({"users": ["userOne", "userTwo", "userThree"]});
});

app.listen(5000, () => {
    console.log('server listening on port 5000');
});