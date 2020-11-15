import React, { Component } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert } from 'react-native';
import SoundPlayer from 'react-native-sound-player';

class PlayAudio extends Component {
    handlePress(){
        try {
            // play the file tone.mp3
            SoundPlayer.playSoundFile('tone', 'mp3')
            // or play from url
            SoundPlayer.playUrl('placeholder.url')
          } catch (e) {
            console.log(`cannot play the sound file`, e)
          }
    }

    render() {
        return(
            <Button 
                onPress={this.handlePress}
                title="Play Quack"
            />
        )
    }
}

export default PlayAudio;