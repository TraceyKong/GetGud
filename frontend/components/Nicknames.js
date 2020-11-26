import React, { useEffect, useState } from 'react';
import { Button, View } from 'react-native';

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
        <View>
            <form onSubmit = {handleSubmit}>
                <label>
                    Your name is currently {name2} . If you do not like it, enter a new name here:
                    <textarea style = {{position: "relative", top: "5px"}} name = 'name' onChange = {handleChange}></textarea>
                </label>
                <input type="submit" value="Submit" />
            </form>
        </View>
    );
}
