const express = require('express');
const {Datastore} = require('@google-cloud/datastore');
const cors = require('cors');
const serviceAccount = require('../serviceAccount.json');

// Database
const db = new Datastore({
    projectId: serviceAccount.project_id,
    keyFilename: './serviceAccount.json'
});

// Express app
const app = express();

app.use(express.json());    // Body parser
app.use(cors());

app.post('/test', async (req, res) => {
    try{
        await db.save({
            key: db.key('visit'),
            data: {data:'test'}
        });
        res.json('done');
    }catch(err){
        res.json(err);
    }
})

app.listen(5000, () => console.log('App listening on port 5000.'));