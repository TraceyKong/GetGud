import React, { useEffect, useState } from 'react';
import { Button, View, TextInput, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postData } from './utils';

export default function Nicknames() {

    const [name2, setName2] = useState('');
    const [hasNickname, setHasNickname] = useState(false);
    const [nickname, setNickname] = useState('');
    const [uuid_val, setUuid] = useState('');
    const [errMessage, setErr] = useState('');

    const handleChange = (event) => {
        setName2(event.target.value);
    }

    const handleSubmit = async(event) => {
        event.preventDefault();

        if(!hasNickname) {
            // postData({ data: name2 })
            //     .then(data => data.json()
                    // console.log(data); // JSON data parsed by `data.json()` call
                    // try{
                    //     AsyncStorage.setItem('UuID', data.key.id);
                    // }catch(err){
                    //     console.log(err);
                    // }
                    // console.log(AsyncStorage.getItem('UuID'));
                    // setHasNickname(true);
                // )
                // .then(res => {
                //     try{
                //         AsyncStorage.setItem('UuID', res.key.id);
                //     }catch(err){
                //         console.log(err);
                //     }
                // })
                // .catch(err => {
                //     console.log(err);
                // });
            try{
                const response = await postData({ data: name2 });
                const data = await response.json();
                setErr(JSON.stringify(data));
                AsyncStorage.setItem('UuID', data.key.id);
                setHasNickname(true);
            }catch(err){
                // setErr(err.toString());
            }
        }
        else {
            const stored_uuid = await AsyncStorage.getItem('UuID');
            const response = await fetch('http://192.168.1.179:8080/updateNickname', {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify({
                    data: stored_uuid,
                    newName: nickname
                }) // body data type must match "Content-Type" header
            }).then(res => res.json()).then(data => console.log(data[0].data));

            //response = response.json();
            //console.log(response.json().then(result => result.data));
        }

        // Sets nickname into AsyncStorage
        console.log(name2);
        try{
            AsyncStorage.setItem('nickname', name2)
        }catch(err){
            console.log(err)
        }
        getData();
    }

    const getData = async () => {
        try {
          const value = await AsyncStorage.getItem('nickname');
          const the_uuid = await AsyncStorage.getItem('UuID');
          if(value !== null) {
              setNickname(value)
              setUuid(the_uuid)
            // value previously stored
          }
        } catch(e) {
            console.log(e)
          // error reading value
        }
      }   
      
    getData();

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
            <Text>{errMessage}</Text>
        </View>
    );
}
