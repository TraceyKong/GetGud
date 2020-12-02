import React, { useEffect, useState } from 'react';
import { Button, View, TextInput, Text } from 'react-native';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default function Nicknames() {

    const [name2, setName2] = useState('');
    const [hasNickname, setHasNickname] = useState(false);

    const handleChange = (event) => {
        setName2(event.target.value);
    }

    // Example POST method implementation:
    async function postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
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
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(data); // parses JSON response into native JavaScript objects
    }

    const handleSubmit = async(event) => {
        event.preventDefault();

        if(!hasNickname) {
            postData('http://localhost:8080/savingNickname', { data: name2 })
            .then(data => {
                console.log(data); // JSON data parsed by `data.json()` call
                cookies.set('UuID', data.key.id);
                console.log(cookies.get('UuID'));
                setHasNickname(true);
            });
        }
        else {
            const response = await fetch('http://localhost:8080/updateNickname', {
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
                    data: cookies.get('UuID'),
                    newName: name2
                }) // body data type must match "Content-Type" header
            }).then(res => res.json()).then(data => console.log(data[0].data));

            //response = response.json();
            //console.log(response.json().then(result => result.data));
        }

        console.log(name2);
    }

    return (
        <View style={{ width: 300 }}>
            <Text>Your name is currently {''}
                <Text style={{ fontWeight: 'bold' }}>{name2}</Text>
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
