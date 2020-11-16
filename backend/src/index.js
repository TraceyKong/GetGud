const express = require('express');
const {Datastore} = require('@google-cloud/datastore');
const {Storage} = require('@google-cloud/storage');
const cors = require('cors');
const serviceAccount = require('../serviceAccount.json');

// Database
const db = new Datastore({
    projectId: serviceAccount.project_id,
    keyFilename: './serviceAccount.json'
});

const storage = new Storage({
    projectId: serviceAccount.project_id,
    keyFilename: './serviceAccount.json'
});

// Express app
const app = express();

app.use(express.json());    // Body parser
app.use(cors());

app.post('/test', async (req, res) => {
    try{
        const options = {
            destination: './yo.mp3'
        }
        await storage.bucket('robust-primacy-294723.appspot.com').file('Dunkey_Quack_Enhanced.mp3').download(options);
        res.json('done');
    }catch(err){
        res.json(err);
    }
})

app.listen(5000, () => console.log('App listening on port 5000.'));