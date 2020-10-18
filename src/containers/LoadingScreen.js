import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { NetworkContext } from "../../network-context";
import config from "../../config";

import Ionicons from "@expo/vector-icons/Ionicons";

function LoadingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.loadingView}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
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
  loadingView: {
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingScreen;
