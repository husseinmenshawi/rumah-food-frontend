import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { NetworkContext } from "../../network-context";
import config from "../../config";

function HomeScreen({ navigation }) {
  const params = React.useContext(NetworkContext);
  const { accessToken, roleId } = params;
  const roleName = roleId == 2 ? "Seller" : "Buyer";
  const [error, setError] = React.useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.text}>
        <Text>Home Screen</Text>
        <Text>{`Welcome ${roleName}`}</Text>
      </View>

      <View></View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    // alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logout: {
    alignItems: "center",
    backgroundColor: "#CCCC00",
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  error: {
    color: "red",
  },
});

export default HomeScreen;
