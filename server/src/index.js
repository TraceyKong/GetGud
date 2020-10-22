const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('../get-gud-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://get-gud-fee28.firebaseio.com"
});

const db = admin.firestore();

const app = express();

app.post('/test', async (req, res) => {
    return res.json("Hello, world!");
})

app.listen(5000, () => console.log('App listening on port 5000.'));