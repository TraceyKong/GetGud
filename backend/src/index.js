require('dotenv').config();
const express = require('express');
const {Datastore} = require('@google-cloud/datastore');
const {Storage} = require('@google-cloud/storage');
const cors = require('cors');
const fs = require('fs');

// Database
const db = new Datastore({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GCP_KEY_FILENAME
});

const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GCP_KEY_FILENAME
});

const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);

// Express app
const app = express();

app.use(express.json());    // Body parser
app.use(cors());

app.post('/test', async (req, res) => {
        const remoteFile = bucket.file(process.env.GCP_AUDIO_NAME);
        let remoteReadStream = remoteFile.createReadStream();
        remoteReadStream.pipe(res);
})

app.listen(5000, () => console.log('App listening on port 5000.'));