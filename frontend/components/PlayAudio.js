import React, { useState, useEffect } from 'react';
import { Button, View, Text } from 'react-native';
import io from "socket.io-client";
import { btoa } from 'js-base64';
import { Audio } from 'expo-av';

// Fetch url from server
// const fetchUri = async () => {
//     await fetch('/getUri')
//         .then(result => { return result.ip })
// }

export default function PlayAudio() {

    // For web version, url is fetched by fetchUri()
    const [socket] = useState(() => io('https://robust-primacy-294723.ue.r.appspot.com/'), {
        transports: ['websocket']
    });

    useEffect(() => {

        let chunks = [];

        socket.on('receiveAudio', data => {
            let dataArray = new Uint8Array(data);
            dataArray.forEach(item => chunks.push(item));
        });

        socket.on('end', () => {
            let audioArray = Uint8Array.from(chunks);
            playAudio(audioArray);
            chunks = [];
        })
    }, []);

    const handleClick = () => {
        socket.emit('sendAudio');
    }

    const playAudio = async arr => {
        let binstr = Array.prototype.map.call(arr, ch => {
            return String.fromCharCode(ch);
        }).join('');
        let base64arr = btoa(binstr);
        let uri = 'data:audio/mp3;base64,' + base64arr;
        await Audio.Sound.createAsync(
            { uri: uri },
            { shouldPlay: true }
        )
    }

    return (
        <View>
            <Button
                onPress={handleClick}
                title="Play Quack"
            />
        </View>
    );
}
