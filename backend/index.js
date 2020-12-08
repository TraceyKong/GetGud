require('dotenv').config();
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

// Sends web app to client
app.use(express.static(__dirname + '/build'));

// Sends domain name to client
// app.get('/getUri', (req, res) => {
//     res.json({ip: 'robust-primacy-294723.ue.r.appspot.com'});
// })

app.post('/savingNickname', async (req, res) => {
    const task = {
        key: db.key('users'),
        data: {
            data: req.body.data
        }
    };

    try{
        // Saves the entity
        await db.save(task);
        // console.log(`Saved ${task}`);
        return res.json(task);
    }catch(err){
        return res.status(400).send(err);
    }
})

app.post('/deleteNickname', authenticateUser, async (req, res) => {
    try {
        await db.delete(req.key); // deletes the record in the db with the same key
        return res.status(200).send('Deleted.');
    } catch(err) {
        return res.status(400).send(err);
    }
})

app.post('/updateNickname', authenticateUser, async (req, res) => {
    const task = { // Creates object using key and updated username
        key: req.key,
        data: {
            data: req.body.newName
        }
    };

    try {
        await db.save(task); // Updates the record in the db with the same key with the info in 'task'
        return res.status(200).send('Updated!');
    } catch(err) {
        return res.status(400).send(err);
    }
})

async function authenticateUser(req, res, next) {
    const key = db.key(['users', Number(req.body.data)]);

    try {
        const response = await db.get(key);
        if(response == undefined) return res.status(400).send('User not found.');

        req.key = key;
        next();
    } catch(err) {
        return res.status(400).send(err);
    }
}

// Websocket
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors:{
        origin: true,
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
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

    socket.on('disconnect', (socket) => {
        console.log("Client disconnected");
        console.log(socket.client.request);
    });

});

server.listen(8080, () => {
    console.log('App listening on port %s', server.address().port)
});

