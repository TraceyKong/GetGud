const express = require('express');
const {Datastore} = require('@google-cloud/datastore');
const {Storage} = require('@google-cloud/storage');
const cors = require('cors');
const request = require('request');

const METADATA_NETWORK_INTERFACE_URL = 'http://metadata/computeMetadata/v1/' +
    '/instance/network-interfaces/0/access-configs/0/external-ip';

// Database
const db = new Datastore();

// Cloud Storage
const storage = new Storage();
const bucket = storage.bucket('robust-primacy-294723.appspot.com');

// Express app
const app = express();

app.use(express.json());
app.use(cors());

app.use('/', (req, res, next) => {
    let options = {
        url: METADATA_NETWORK_INTERFACE_URL,
        headers: {
            'Metadata-Flavor': 'Google'
        }
    };

    let address = request(options, (err, resp, body) => {
        if (err || resp.statusCode !== 200) {
            console.log('Error while talking to metadata server, assuming localhost');
            return 'localhost';
        }
        return body;
    });
    
    res.cookie('app-ip', address);
    next();
})
app.use(express.static(__dirname + '/views'));

app.listen(process.env.PORT || 8080, () => {
    console.log('App listening on port 8080')
});

// Websocket
const socket_app = express();
const server1 = require('http').createServer(socket_app);
const io = require('socket.io')(server1, {
    cors: {
        origin: true,
        methods: ['GET', 'POST']
    }
});

io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on('sendAudio', () => {
        const remoteFile = bucket.file('On_Sight.mp3');
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

server1.listen(65080, () => {
    console.log('App listening on port %s', server1.address().port)
});

