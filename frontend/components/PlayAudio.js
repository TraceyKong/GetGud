import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import io from "socket.io-client";
import { btoa } from "js-base64";
import { Audio } from "expo-av";
import { Button } from "@material-ui/core";

const LOCALHOST = "192.168.0.9";

export default function PlayAudio() {
  const [socket] = useState(() => io(`http://${LOCALHOST}:8080`));
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
  }, []);

  const handleClick = () => {
    socket.emit("sendAudio");
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

  return (
    <View alignItems="center" justifyContent="center">
      <Button
        alignItems="center"
        fullWidth
        type="Play Quack"
        variant="contained"
        color="secondary"
        onPress={handleClick}
        title="Play Quack"
        style={{
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          height: "300px",
          width: "100%",
          fontSize: "50px",
          backgroundColor: "#E9967A",
        }}
      >
        GET GUD
      </Button>
    </View>
  );
}
