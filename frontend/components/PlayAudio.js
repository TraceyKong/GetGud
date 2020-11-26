import React, { useState, useEffect } from 'react';
import { Button, View, Text } from 'react-native';
import io from "socket.io-client";
import { encode as btoa } from 'base-64';
import { Audio } from 'expo-av';

export default function PlayAudio() {
    const [socket] = useState(() => io("http://192.168.1.154:8080"));

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
