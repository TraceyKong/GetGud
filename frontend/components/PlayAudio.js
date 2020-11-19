import React, { useEffect } from 'react';
import { Button, View } from 'react-native';
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:8080";
const socket = socketIOClient(ENDPOINT);

export default function PlayAudio() {
    
    useEffect(() => {
        let chunks = [];

        socket.on('receiveAudio', data => {
            let dataArray = new Uint8Array(data);
            dataArray.forEach(item => chunks.push(item));
        });

        socket.on('end', () => {
            let audioBlob = new Blob([Uint8Array.from(chunks)], { type: 'audio/mp3'});
            playAudio(audioBlob);
            chunks = [];
        })
    }, []);

    const handleClick = () => {
        socket.emit('sendAudio');
    }

    const playAudio = async blob => {
        let url = window.URL.createObjectURL(blob);
        window.audio = new Audio();
        window.audio.src = url;
        window.audio.play();
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
