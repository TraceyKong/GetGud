import React, { Component, PureComponent } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert } from 'react-native';
import { Audio } from 'expo-av';
import socketIOClient from "socket.io-client";
import { useState, useEffect } from 'react';

const ENDPOINT = "http://localhost:8080";
const socket = socketIOClient(ENDPOINT);


export default class PlayAudio extends Component {

    constructor(){
        super();
        this.state = { 
            value: true,
        }
        this.handlePlay = this.handlePlay.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    
    componentDidMount() {
        socket.on('message', () => {
        })
        socket.addEventListener('message', () => {
            this.handlePlay();
        })
    }

    handleClick = () => {
        socket.emit("message")
    }

    handlePlay = async () => {
        this.setState({ value: false });
        try{
            let audio = await fetch('http://localhost:8080/test', {
                mode: 'cors',    
                method: 'POST'
            })
                .then(response => response.body)
                .then(body => {
                    const reader = body.getReader();
                    return reader
                            .read()
                            .then(result => result);
                })
                .catch(err => console.log(err));
            
                let blob = new Blob([audio.value], {type: 'audio/mp3'});
                let url = window.URL.createObjectURL(blob);
                await Audio.Sound.createAsync(
                    url,
                    {shouldPlay: true}
                )
                this.setState({ value: true })
            }catch(err){
                console.log(err);
            }
    }

    render() {
        return (
          <View>
            <Button
              onPress={(event) => {
                //   this.handlePlay();
                  this.handleClick();
                }}
              title="Play Quack"
              disabled={!this.state.value}
            />
          </View>
        );
    }
}