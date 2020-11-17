import React, { useState, useEffect } from 'react';
import { Button, View, Text } from 'react-native';
import { Audio } from 'expo-av';
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:8080";
const socket = socketIOClient(ENDPOINT);

export default function PlayAudio() {
    const [value, setValue] = useState(true);
    
    useEffect(() => {
        socket.on('message', data => {
            console.log(data);
        })
        socket.addEventListener('message', () => {
            handlePlay();
            console.log('played');
        })
    }, []);

    const handleClick = () => {
        socket.emit("message")
    }

    const handlePlay = async () => {
        setValue(false);
        const soundObj = new Audio.Sound();
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
                                let blob = new Blob([result.value], {type: 'audio/mp3'});
                                return blob;
                            });
                })
                .catch(err => console.log(err));
                let url = window.URL.createObjectURL(audioBlob);
                await Audio.Sound.createAsync(
                    url,
                    {
                        shouldPlay: true,
                        downloadFirst: true
                    }
                );
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
