import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";
import AppNavigator from "./src/navigation/AppNavigator";

function App() {
  React.useEffect(() => {
    async function getSplash() {
      await SplashScreen.preventAutoHideAsync();
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 5000);
    }
    getSplash();
  }, []);
  return (
    <NavigationContainer>
      <AppNavigator initialRouteName="Auth" />
    </NavigationContainer>
  );
}

export default App;
