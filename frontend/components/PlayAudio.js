import React, { Component } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert } from 'react-native';
// import Sound from 'react-native-sound'
// import SoundPlayer from 'react-native-sound-player';
import { Audio } from 'expo-av';

class PlayAudio extends Component {
    handlePress = async () => {
        // try {
        //     // play the file tone.mp3
        //     SoundPlayer.playSoundFile('tone', 'mp3')
        //     // or play from url
        //     SoundPlayer.playUrl('placeholder.url')
        //   } catch (e) {
        //     console.log(`cannot play the sound file`, e)
        //   }
        // const sound = new Sound('http://sounds.com/some-sound', null, (error) => {
        // if (error) {
        //     // do something
        // }
        
        // play when loaded
        // sound.play();
        // });

        try{
            await Audio.Sound.createAsync(
                {uri: 'gs://robust-primacy-294723.appspot.com/Dunkey_Quack_Enhanced.mp3'},
                {shouldPlay: true}
            );
        }catch(err){
            console.log(err);
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