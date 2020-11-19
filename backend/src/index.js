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
    res.send({response: "I am alive"}).status(200);
})

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

