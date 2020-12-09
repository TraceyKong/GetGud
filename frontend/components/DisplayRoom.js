import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function DisplayRoom(props){

    const socket = props.socket;

    const [senderNickname, setSenderNickname] = useState('');

    useEffect(() => {
        socket.on('receiveSender', (data) =>{
            setSenderNickname(data.nickname);
        })
    }, [socket]);

    return(
        <View>
            <Text>
                {senderNickname} has told you to GET GUD
            </Text>
        </View>
    )
}