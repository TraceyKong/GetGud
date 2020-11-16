import React, { Component, PureComponent } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert } from 'react-native';
// import Sound from 'react-native-sound'
// import SoundPlayer from 'react-native-sound-player';
import { Audio } from 'expo-av';

class PlayAudio extends Component {
    constructor(){
        super();
        this.state = { value: true }
        this.handlePress = this.handlePress.bind(this);
    }

    handlePress = async () => {
        this.setState({ value: false })
        try{
            let audio = await fetch('http://localhost:5000/test', {
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
        return(
            <Button 
                onPress={this.handlePress}
                title="Play Quack"
                disabled={!this.state.value}
            />
        )
    }
}

export default PlayAudio;