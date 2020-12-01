import React, { useEffect, useState } from "react";
import { View, TextInput, Text } from "react-native";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import { createStackNavigator, createAppContainer } from "react-navigation";

export default function Nicknames() {
  const [name2, setName2] = useState("");

  const handleChange = (event) => {
    setName2(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(name2);
  };

  return (
    <View>
      <Text style={{ fontSize: "50px" }}>
        Your name is currently {""}
        <Text style={{ fontWeight: "bold" }}>{name2}</Text>
      </Text>
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
            onPress={handleSubmit}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </View>
  );
}
