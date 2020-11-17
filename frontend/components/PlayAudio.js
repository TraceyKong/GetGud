import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import { Audio } from 'expo-av';

function PlayAudio(){
    const [value, setValue] = useState(true);

    const handlePress = async () => {
        setValue(false);
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
                setValue(true);
            }catch(err){
                console.log(err);
            }
    }

    return (
        <View>
        <Button
            onPress={handlePress}
            title="Play Quack"
            disabled={!value}
        />

        <Text>websocket echo:</Text>
        </View>
    );
}

export default PlayAudio;