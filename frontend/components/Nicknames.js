import React, { useEffect, useState } from 'react';
import { Button, View, TextInput, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postData, updateData } from './utils';

export default function Nicknames() {

    const [name2, setName2] = useState('');
    const [hasNickname, setHasNickname] = useState(false);
    const [nickname, setNickname] = useState('');
    const [uuid_val, setUuid] = useState('');

    useEffect(async () => {
        try {
            const stored_uuid = await AsyncStorage.getItem('UuID');
            const value = await AsyncStorage.getItem('nickname');
            if(value != null){
                setNickname(value);
                setUuid(stored_uuid);
                setHasNickname(true);
            }
        } catch(err) {
            console.log(err);
        }
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if(!hasNickname) {
                const response = await postData({ data: name2 });
                const data = await response.json();
                await AsyncStorage.setItem('UuID', data.key.id);
                setUuid(data.key.id);
                setHasNickname(true);
                console.log('Nickname saved:', name2);
            } else {
                const stored_uuid = await AsyncStorage.getItem('UuID');
                const newData = {
                    data: stored_uuid,
                    newName: name2
                }
                const response = await updateData(newData);
                if(response.status == 200) console.log('Nickname updated:', name2);
                else console.log('Failed to update.')
            }

            await AsyncStorage.setItem('nickname', name2);
            setNickname(name2);
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <View style={{ width: 300 }}>
            <Text>The UuID is: {uuid_val}</Text>
            <Text>Your name is currently {''}
                <Text style={{ fontWeight: 'bold' }}>{nickname}</Text>
            </Text>
            <Text>If you do not like it, enter a new name here:</Text>
            
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={text => setName2(text)}
                value={name2} 
            />
            <Button
                title='Submit'
                onPress={handleSubmit}
            />
        </View>
    );
}
