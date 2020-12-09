import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import { View } from "react-native";
import io from "socket.io-client";
import PlayAudio from "./components/PlayAudio";
import Nicknames from "./components/Nicknames";
import DisplayRoom from "./components/DisplayRoom";
import ConcurrentUser from "./components/ConcurrentUser";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

export default function App() {

	const socket = useMemo(() => io('http://192.168.1.179:8080/', {
		reconnection: true,
		reconnectionAttempts: Infinity,
		timeout: 60000,
		transports: ['websocket']
	}), []);

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
						<Nicknames socket={socket}/>
					</Grid>
					<Grid item xs={12}>
						<PlayAudio socket={socket}/>
					</Grid>
					<Grid item xs={12}>
						<DisplayRoom socket={socket}/>
					</Grid>
					<Grid item xs={12}>
						<ConcurrentUser socket={socket}/>
					</Grid>
				</Grid>
			</View>
		</Box>
	);
}
