import React, { useEffect } from 'react';
import { Button, View } from 'react-native';
import socketIOClient from "socket.io-client";
import ss from 'socket.io-stream';

const ENDPOINT = "http://localhost:8080";
const socket = socketIOClient(ENDPOINT);

export default function PlayAudio() {
    
    useEffect(() => {
        ss(socket).on('message', stream => {
            let chunks = [];

            stream.on('data', data => {
                data.forEach(item => chunks.push(item));
            });

            stream.on('end', () => {
                let audioBlob = new Blob([Uint8Array.from(chunks)], {type: 'audio/mp3'});
                playAudio(audioBlob);
            });
        })
    }, []);

    const handleClick = () => {
        ss(socket).emit('message');
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
