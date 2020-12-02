require('dotenv').config();
const express = require('express');
const {Datastore} = require('@google-cloud/datastore');
const {Storage} = require('@google-cloud/storage');
const cors = require('cors');

// Database
const db = new Datastore({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GCP_KEY_FILENAME
});

// Cloud Storage
const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GCP_KEY_FILENAME
});
const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);

// Express app
const app = express();

app.use(express.json());
app.use(cors()); 

app.get('/', (req, res) => {
    console.log(req.socket.address());
})

app.post('/savingNickname', async(req,res) => {
    // console.log('Hello I am cheese');

    const kind = 'visit';

    const taskKey = db.key(kind);

    const task = {
        key: taskKey,
        data: {
            data: req.body.data, //'Ur mom is kinda cute',
        },
    };

    // Saves the entity
    await db.save(task);

    // Saves the entity
    // console.log(`Saved ${task}`);

    return res.json(task);

    //http://localhost:8080/savingNickname
})

app.post('/deleteNickname', authenticateUser, async(req,res) => {
    const key = db.key(['visit', Number(req.body.data)]); // gets the key of the current user using their Unique ID

    const response = await db.delete(key); // deletes the record in the db with the same key

    req.user = response;

    return res.json(req.user);
})

app.post('/updateNickname', authenticateUser, async(req,res) => {
    const key = db.key(['visit', Number(req.body.data)]); // gets the key of the current user using their Unique ID

    // console.log('----------------');
    // console.log(req.body.data);
    // console.log('----------------');

    const task = { // Creates object using key and updated username
        key: key,
        data: {
            data: req.body.newName, //'Ur mom is kinda cute',
        },
    };

    const response = await db.save(task); // Updates the record in the db with the same key with the info in 'task'

    req.user = response;

    return res.json(req.user);
})

async function authenticateUser(req,res,next) {
    // const query = db.createQuery('visit').filter('Key.id', '=', req.body.data);
    // const tasks = await db.runQuery(query);
    // console.log('IDs:');
    // console.log(tasks);
    // // tasks.forEach(task => { 
    // //     console.log(task);

    // //     if(task == req.body.data) {
    // //         next();
    // //     }
    // // });

    //console.log(req.body.data);

    const key = db.key(['visit', Number(req.body.data)]);

    // db.get(key, (err,entity) => {
    //     if(err) {
    //         return res.json(err);
    //     }
    //     else {
    //         console.log(entity);
    //         return res.json(entity);
    //     }
    // })

    try {
        // const response = await db.get(key).then((data) => {
        //     req.user = data[0];
        //     return (data[0]);
        // });

        const response = await db.get(key);

        //console.log(response.json().data[0].data);

        // return res.json({ user: response });

        req.user = response;

        next();
    }
    catch(err) {
        return res.json(err);
    }
}

// Websocket
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: true,
        methods: ['GET', 'POST']
    }
});

io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on('sendAudio', () => {
        const remoteFile = bucket.file(process.env.GCP_AUDIO_NAME);
        const remoteReadStream = remoteFile.createReadStream();

        remoteReadStream.on('open', () => {
            console.log('loading audio');
        });
        
        remoteReadStream.on('data', chunk => {
            socket.broadcast.emit('receiveAudio', chunk);
        });
        
        remoteReadStream.on('end', () => {
            socket.broadcast.emit('end');
        })
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
module.exports = app;

