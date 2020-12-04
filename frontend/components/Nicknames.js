import React, { useEffect, useState } from "react";
import { View, TextInput, Text } from "react-native";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postData, updateData } from './utils';

export default function Nicknames() {
    const [name2, setName2] = useState('');
    const [hasNickname, setHasNickname] = useState(false);
    const [nickname, setNickname] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const value = await AsyncStorage.getItem('nickname');
                if(value != null){
                    setNickname(value);
                    setHasNickname(true);
                }
            } catch(err) {
                console.log(err);
            }
        }
        loadData();
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if(!hasNickname) {
                const response = await postData({ data: name2 });
                const data = await response.json();
                await AsyncStorage.setItem('UuID', data.key.id);
                setHasNickname(true);
                console.log('Nickname saved:', name2);
                await AsyncStorage.setItem('nickname', name2);
                setNickname(name2);
            } else {
                const stored_uuid = await AsyncStorage.getItem('UuID');
                const newData = {
                    data: stored_uuid,
                    newName: name2
                }
                const response = await updateData(newData);
                if(response.status == 200) console.log('Nickname updated:', name2);
                else console.log('Failed to update.')
            }

        } catch(err) {
            console.log(err);
        }
    }

    return (
        <View>
            {hasNickname ? (
                    <Text style={{ fontSize: "50px" }}>
                        Your name is currently {""}
                        <Text style={{ fontWeight: "bold" }}>{nickname}</Text>
                    </Text>
                ) : (
                    <Text style={{ fontSize: "50px" }}>
                        Please enter a name
                    </Text>
                )
            }

            <Text style={{ marginBottom: "10px" }}>
                If you do not like it, enter a new name here:
            </Text>
            <Grid spacing={2} container>
            <Grid item xs={8}>
                <TextInput
                    style={{
                        width: "100%",
                        height: 45,
                        borderColor: "gray",
                        borderWidth: 1,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                    }}
                    onChangeText={(text) => setName2(text)}
                    value={name2}
                />
            </Grid>
            <Grid item xs={4}>
                <Button
                    style={{ fontSize: "20px" }}
                    fullWidth
                    type="submit"
                    variant="outlined"
                    color="secondary"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </Grid>
            </Grid>
        </View>
    );
}
