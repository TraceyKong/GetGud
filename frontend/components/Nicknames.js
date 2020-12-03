import React, { useEffect, useState } from 'react';
import { Button, View, TextInput, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postData, updateData } from './utils';

export default function Nicknames() {

    const [name2, setName2] = useState('');
    const [hasNickname, setHasNickname] = useState(false);
    const [nickname, setNickname] = useState('');
    const [uuid_val, setUuid] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if(!hasNickname) {
                const response = await postData({ data: name2 });
                const data = await response.json();
                await AsyncStorage.setItem('UuID', data.key.id);
                setHasNickname(true);
                console.log('Nickname saved.')
            } else {
                const stored_uuid = await AsyncStorage.getItem('UuID');
                const newData = {
                    data: stored_uuid,
                    newName: name2
                }
                const response = await updateData(newData);
                if(response.status == 200) console.log('Nickname updated.');
                else console.log('Failed to update.')
            }

            await AsyncStorage.setItem('nickname', name2);
            setNickname(name2);
        } catch(err) {
            console.log(err);
        }

        getData();
    }

    const getData = async () => {
        try {
          const value = await AsyncStorage.getItem('nickname');
          const the_uuid = await AsyncStorage.getItem('UuID');
          if(value !== null) {
              setUuid(the_uuid)
            // value previously stored
          }
        } catch(e) {
            console.log(e)
          // error reading value
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
