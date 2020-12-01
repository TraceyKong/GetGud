import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import PlayAudio from "./components/PlayAudio";
import Nicknames from "./components/Nicknames";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

export default function App() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      style={{ height: "100%" }}
    >
      <View>
        <Grid
          style={{ width: "500px" }}
          size="medium"
          container
          spacing={2}
          direction="row"
        >
          <StatusBar style="auto" />
          <Grid item xs={12}>
            <Nicknames />
          </Grid>
          <Grid item xs={12}>
            <PlayAudio />
          </Grid>
        </Grid>
      </View>
    </Box>
  );
}
