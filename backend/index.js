require('dotenv').config();
const express = require('express');
const {Datastore} = require('@google-cloud/datastore');
const {Storage} = require('@google-cloud/storage');
const cors = require('cors');

// Database
// const db = new Datastore();

const db = new Datastore({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GCP_KEY_FILENAME
});

// Cloud Storage
const storage = new Storage();
const bucket = storage.bucket('robust-primacy-294723.appspot.com');

// Express app
const app = express();

app.use(cors());
app.use(express.json());

// Sends web app to client
app.use(express.static(__dirname + '/build'));

// Websocket
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors:{
        origin: true,
        methods: ['GET', 'POST']
    }
});

var user_count = 0;

io.on('connection', async (socket) => {
    console.log("New client connected");
    const curr_connection = socket.id;

    user_count++;

    let user_names = [];
    const query = db.createQuery('users');
    const [tasks] = await db.runQuery(query);
    tasks.forEach(task => user_names.push(task.nickname));
    socket.emit('receiveNickname', {
        usernames: user_names
    });
    
    socket.on('counter', () => {
        socket.emit('counter', {
            user_count: user_count,
        });
    });

    socket.on('getNicknames', async() => {
        let user_names = [];
        const query = db.createQuery('users');
        const [tasks] = await db.runQuery(query);
        tasks.forEach(task => user_names.push(task.nickname));
        socket.emit('receiveNickname', {
            usernames: user_names
        });
    });

    socket.on('sendAudio', (data) => {

        const audioFileNumber = Math.floor( (Math.random() * 10) + 1 );

        const audioFileName = "Get_Gud_" + audioFileNumber.toString() + ".mp3";

        // const remoteFile = bucket.file('On_Sight.mp3');
        const remoteFile = bucket.file(audioFileName);
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

        socket.broadcast.emit('receiveSender', {
            nickname: data.nickname
        });
    });

    socket.on('saveNickname', async (data) => {
        const task = {
            key: db.key(['users', curr_connection]),
            data:{
                nickname: data.nickname,
            }
        };

        try{
            // Saves the entity
            await db.save(task);
        }catch(err){
            console.log(err);
        }

        let user_names = [];
        const query = db.createQuery('users');
        const [tasks] = await db.runQuery(query);
        tasks.forEach(task => user_names.push(task.nickname));
        socket.emit('receiveNickname', {
            usernames: user_names
        });
    });

    socket.on('updateNickname', async (data) =>{
        const task = { // Creates object using key and updated username
            key: db.key(['users', curr_connection]),
            data: {
                nickname: data.newName,
            }
        };
    
        try {
            await db.save(task); // Updates the record in the db with the same key with the info in 'task'
            console.log('UPDATE SUCCESS');
        } catch(err) {
            console.log(err);
        }

        let user_names = [];
        const query = db.createQuery('users');
        const [tasks] = await db.runQuery(query);
        tasks.forEach(task => user_names.push(task.nickname));
        socket.emit('receiveNickname', {
            usernames: user_names
        });
    });

    socket.on('disconnect', async () => {
        console.log("Client disconnected");
        user_count--;
        socket.broadcast.emit('counter', {
            user_count: user_count
        });

        let key = db.key(['users', curr_connection]);
        try {
            await db.delete(key); // deletes the record in the db with the same key
            console.log('DELETE SUCCESS');
        } catch(err) {
            console.log(err);
        }

        let user_names = [];
        const query = db.createQuery('users');
        const [tasks] = await db.runQuery(query);
        tasks.forEach(task => user_names.push(task.nickname));
        socket.broadcast.emit('receiveNickname', {
            usernames: user_names
        });
    });

});

server.listen(8080, () => {
    console.log('App listening on port %s', server.address().port)
});

