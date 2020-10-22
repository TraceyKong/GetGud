const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('../get-gud-key.json');
const cors = require('cors');

// Connect to firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://get-gud-fee28.firebaseio.com"
});

// Database
const db = admin.firestore();

// Express app
const app = express();

app.use(express.json());    // Body parser
app.use(cors());

app.post('/test', async (req, res) => {
    return res.json("Hello, world!");
})

app.listen(5000, () => console.log('App listening on port 5000.'));