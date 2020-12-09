import React, { useEffect } from "react";
import { View } from "react-native";
import { btoa } from "js-base64";
import { Audio } from "expo-av";
import { Button } from "@material-ui/core";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PlayAudio(props) {
  const socket = props.socket;

  useEffect(() => {
    let chunks = [];

    socket.on("receiveAudio", (data) => {
      let dataArray = new Uint8Array(data);
      dataArray.forEach((item) => chunks.push(item));
    });

    socket.on("end", () => {
      let audioArray = Uint8Array.from(chunks);
      playAudio(audioArray);
      chunks = [];
    });
  }, [socket]);

  const handleClick = async () => {
    const value = await AsyncStorage.getItem("nickname");
    if (value != null) {
      socket.emit("sendAudio", {
        nickname: value,
      });
    } else {
      alert("Enter a nickname!");
    }
  };

  const playAudio = async (arr) => {
    let binstr = Array.prototype.map
      .call(arr, (ch) => {
        return String.fromCharCode(ch);
      })
      .join("");
    let base64arr = btoa(binstr);
    let uri = "data:audio/mp3;base64," + base64arr;
    await Audio.Sound.createAsync({ uri: uri }, { shouldPlay: true });
  };

  const hookedStyles = {
    view: {
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      alignItems: "center",
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      height: "300px",
      width: "100%",
      fontSize: "50px",
      marginTop: "10px",
      backgroundColor: "#E9967A",
    },
  };

  return (
    <View style={hookedStyles.view}>
      <Button
        fullWidth
        type="Play Quack"
        variant="contained"
        color="secondary"
        onClick={handleClick}
        title="Play Quack"
        style={hookedStyles.button}
      >
        GET GUD
      </Button>
    </View>
  );
}
