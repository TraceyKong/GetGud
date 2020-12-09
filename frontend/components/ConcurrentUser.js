import React, { useEffect, useState } from "react";
import { View , Text } from "react-native";
import { Button } from "@material-ui/core";

export default function ConcurrentUser(props){
    const socket = props.socket;

    const [userCount, setUserCount] = useState('');
    const [userNames, setUserNames] = useState([]);
    
    useEffect(() => {
        // setInterval( () => {
        //     socket.emit('counter');
        // }, 10000);

        socket.on('counter', (data) =>{
            setUserCount(data.user_count);
        });

        socket.on('receiveNickname', (data) => {
            const temp = data.usernames;
            setUserNames(temp);
        })

    }, [socket]);

    const handleClick = () => {
        socket.emit('counter');
        socket.emit('getNicknames');
    }

    return(
        <View>
            <Text
                style={{ fontSize: "25px" }}
            >
                Online Users: {userCount}
            </Text>

            <Button
                fullWidth
                type="submit"
                variant="outlined"
                color="secondary"
                onClick={handleClick}
            >
                Refresh Online Users
            </Button>

            <Text
                style={{ fontSize: "25px" }}
            >
                List of Users: {"\n"}
                {userNames.map((user, key) => (
                    <Text key={key}> {user} {"\n"}</Text>)
                )}
            </Text>
        </View>
    )
}