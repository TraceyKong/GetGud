const express = require('express');
const {Datastore} = require('@google-cloud/datastore');
const {Storage} = require('@google-cloud/storage');
const cors = require('cors');

// Database
const db = new Datastore();

// Cloud Storage
const storage = new Storage();
const bucket = storage.bucket('robust-primacy-294723.appspot.com');

// Express app
const app = express();

app.use(cors());
app.use(express.json());

// Sends ip address to client
// app.use('/', (req, res, next) => {    
//     res.cookie('app-ip', 'robust-primacy-294723.ue.r.appspot.com');
//     next();
// });

// Sends web app to client
app.use(express.static(__dirname + '/views'));

// Sends domain name to client
app.get('/getUri', (req, res) => {
    res.json({ip: 'robust-primacy-294723.ue.r.appspot.com'});
})

// Websocket
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors:{
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

server.listen(8080, () => {
    console.log('App listening on port %s', server.address().port)
});

