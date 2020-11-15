import React, { Component } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert } from 'react-native';
import Sound from 'react-native-sound'
import SoundPlayer from 'react-native-sound-player';

class PlayAudio extends Component {
    handlePress(){
        // try {
        //     // play the file tone.mp3
        //     SoundPlayer.playSoundFile('tone', 'mp3')
        //     // or play from url
        //     SoundPlayer.playUrl('placeholder.url')
        //   } catch (e) {
        //     console.log(`cannot play the sound file`, e)
        //   }
        const sound = new Sound('http://sounds.com/some-sound', null, (error) => {
        if (error) {
            // do something
        }
        
        // play when loaded
        sound.play();
        });
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