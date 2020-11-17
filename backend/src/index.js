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

app.use(express.json());    // Body parser
app.use(cors());

app.post('/test', async (req, res) => {
        const remoteFile = bucket.file(process.env.GCP_AUDIO_NAME);
        const remoteReadStream = remoteFile.createReadStream();
        remoteReadStream.pipe(res);
})

app.get('/', (req, res) => {
    res.send({response: "I am alive"}).status(200);
})

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: true,
        methods: ['GET', 'POST']
    }
}); // < Interesting!

io.on("connection", (socket) => {
    let interval;
    console.log("New client connected");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);

    socket.on('message', function (msg) {
        socket.emit('message', msg)
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    });
});

server.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));

const getApiAndEmit = socket => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit('FromAPI', response);
};

const buttonSuccessful = socket => {
    const response = new Date();
    socket.on("message", () => {
        socket.emit("message", response);
      })
}



// app.listen(5000, () => console.log('App listening on port 5000.'));
