import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddItemScreen from "../containers/AddItemScreen";
import { NetworkContext } from "../../network-context";

const Stack = createStackNavigator();

export default function AddItemStack({ route, navigation }) {
  const { params } = route;
  return (
    <NetworkContext.Provider value={params}>
      <Stack.Navigator>
        <Stack.Screen name="Add Item" component={AddItemScreen} />
      </Stack.Navigator>
    </NetworkContext.Provider>
  );
}
