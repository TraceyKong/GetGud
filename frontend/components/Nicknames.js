import React, { useEffect, useState } from 'react';
import { Button, View, TextInput, Text } from 'react-native';

export default function Nicknames() {

    const [name2, setName2] = useState('');

    const handleChange = (event) => {
        setName2(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
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
