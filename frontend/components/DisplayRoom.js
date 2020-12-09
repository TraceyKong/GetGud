import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { View , Text } from "react-native";

export default function DisplayRoom(props){

    const socket = props.socket;

    const [senderNickname, setSenderNickname] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        socket.on('receiveSender', (data) =>{
            setSenderNickname(data.nickname);
            handleOpen();
        })
    }, [socket]);

    const handleOpen = () => {
        setOpen(true);
        setTimeout(() => {
            handleClose()
        }, 3000)
      };
    
    const handleClose = () => {
        setOpen(false);
    };

    return(
        <View>
            <Grid item xs>
                {open ? (
                        <Text
                            open={open}
                            onClose={handleClose}
                            style={{ fontSize: "30px" }}
                        >
                            {senderNickname} has told you to get gud
                        </Text>
                    ) : (
                        <Text></Text>
                    )
                }
            </Grid>
        </View>
    )
}