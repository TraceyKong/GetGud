require('dotenv').config();
const express = require('express');
const {Datastore} = require('@google-cloud/datastore');
const {Storage} = require('@google-cloud/storage');
const cors = require('cors');
const fs = require('fs');
const http = require("http");
const socketIo = require("socket.io");

// const port = process.env.PORT || 4001;
const port = 8080;

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

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"]
    }
}); // < Interesting!

app.get('/', (req, res) => {
    res.send({response: "I am alive"}).status(200);
})

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

const getApiAndEmit = socket => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
};



// app.listen(5000, () => console.log('App listening on port 5000.'));


