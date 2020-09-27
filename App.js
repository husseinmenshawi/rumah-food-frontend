import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AppNavigator from "./src/navigation/AppNavigator";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <AppNavigator initialRouteName="Auth" />
    </NavigationContainer>
  );
}

export default App;
