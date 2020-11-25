import React, { useEffect, useState } from 'react';
import { Button, View } from 'react-native';

export default function Nicknames() {

    const [name, setName] = useState('');

    const handleChange = (event) => {
        setName(event.target.value);
    }

    const handleSubmit = (event) => {
        console.log(name);
    }

    return (
        <View>
            <form onSubmit = {() => handleSubmit}>
                <label>
                    Yo yo yo, enter something below!
                    <textarea onChange = {() => handleChange}></textarea>
                </label>
                <input type="submit" value="Submit" />
            </form>
        </View>
    );
}
