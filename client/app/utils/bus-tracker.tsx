import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { View, Text, FlatList} from "react-native";

// interface for correct typing
interface Bus {
  id: number | string;
  tripId: string | null;
  position: {
    latitude: number;
    longitude: number;
    speed: number;
    bearing: number;
  };
}

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  autoConnect: true,
});

export default function BusTracker() {
  // intially null
  const [buses, setBuses] = useState<Bus[]>([]);

  useEffect(() => {
    // call useEffect to pull on web socket from server
    socket.on("connect", () => {
      console.log("connected to server", socket.id);
    });

    // each bus update
    socket.on("busUpdate", (data) => {
      setBuses(data);
    });

    // on disconnect notify
    socket.on("disconnect", () => {
      console.log("disconnected from server");
    })

    // turn off on return
    return () => {
      socket.off('connect');
      socket.off('busUpdate');
      socket.off('disconnect');
      socket.off('error');
      socket.disconnect();
    };
  // don't put buses in here (removes and readds on each update)
  }, []);
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{}}>
        Hello Bus App!
      </Text>
      <FlatList
        data={buses}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View>
            <Text>
              Route {item.tripId ?? item.id};
            </Text>
            <Text>
              Lat: {item.position.latitude.toFixed(5)}
            </Text>
            <Text>
              Lon: {item.position.longitude.toFixed(5)}
            </Text>
            <Text>
              Speed: {item.position.speed}
            </Text>
            <Text>
              Bearing: {item.position.bearing}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text> Waiting... </Text>}
      />
    </View>
  );
}
