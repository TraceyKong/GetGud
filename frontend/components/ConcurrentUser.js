import React, { useEffect, useState } from "react";
import { View , Text } from "react-native";

export default function ConcurrentUser(props){
    const socket = props.socket;

    const [userCount, setUserCount] = useState('');
    
    useEffect(() => {
        socket.on('counter', (data) =>{
            setUserCount(data.user_count)
        })
    }, [socket]);

    return(
        <View>
            <Text
                style={{ fontSize: "50px" }}
            >
                Online User Count: {userCount}
            </Text>
        </View>
    )
}