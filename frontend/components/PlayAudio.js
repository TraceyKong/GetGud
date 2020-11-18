import React, { useState, useEffect } from 'react';
import { Button, View, Text } from 'react-native';
// import { Audio } from 'expo-av';
import socketIOClient from "socket.io-client";
import ss from 'socket.io-stream';

const ENDPOINT = "http://localhost:8080";
const socket = socketIOClient(ENDPOINT);

export default function PlayAudio() {
    const [value, setValue] = useState(true);
    
    useEffect(() => {
        ss(socket).on('message', stream => {
            let chunks = [];
            stream.on('data', data => {
                console.log(data);
            })
            console.log(chunks);
            // let audioBlob = new Blob([Uint8Array.from(chunks)], {type: 'audio/mp3'});
            // playBlob(audioBlob);
        })
        socket.addEventListener('message', () => {
            handlePlay();
            console.log('played');
        })
    }, []);

    const handleClick = () => {
        ss(socket).emit("message");
    }

    const playBlob = async blob => {
        let url = window.URL.createObjectURL(blob);
        window.audio = new Audio();
        window.audio.src = url;
        window.audio.play();
    }

    const handlePlay = async () => {
        setValue(false);
        try{
            let audioBlob = await fetch('http://localhost:8080/test', {
                    mode: 'cors',    
                    method: 'POST'
                })
                .then(response => response.body)
                .then(body => {
                    const reader = body.getReader();
                    return reader
                            .read()
                            .then(result => {
                                console.log(result.value);
                                let blob = new Blob([result.value], {type: 'audio/mp3'});
                                return blob;
                            });
                })
                .catch(err => console.log(err));
            playBlob(audioBlob);
            setValue(true);
        }catch(err){
            console.log(err);
        }
    }

    return (
        <View>
        <Button
            onPress={(event) => {
            //   this.handlePlay();
                handleClick();
            }}
            title="Play Quack"
            disabled={!value}
        />
        </View>
    );
}
