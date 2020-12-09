import React, { useEffect, useState } from "react";
import { View , Text } from "react-native";
import { Button } from "@material-ui/core";

export default function ConcurrentUser(props){
    const socket = props.socket;

    const [userCount, setUserCount] = useState('');
    const [userNames, setUserNames] = useState([]);
    
    useEffect(() => {
        socket.on('counter', (data) =>{
            setUserCount(data.user_count);
        });

        socket.on('receiveNickname', (data) => {
            const temp = data.usernames;
            setUserNames(temp);
            console.log('receive-user', userNames);
        })

    }, [socket]);

    const handleClick = () => {
        socket.emit('getNicknames');
    }

    return(
        <View>
            <Text
                style={{ fontSize: "50px" }}
            >
                Online User Count: {userCount}
            </Text>

            <Button
                onClick={handleClick}
            >
                Refresh Online Users
            </Button>

            <Text
                style={{ fontSize: "50px" }}
            >
                List of Users: {"\n"}
                    {userNames.map((user, key) => (
                        <Text key={key}> {user} {"\n"}</Text>)
                    )}
            </Text>
        </View>
    )
}