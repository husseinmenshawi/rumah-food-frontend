import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddCapacityScreen from "../containers/AddCapacityScreen";
import { NetworkContext } from "../../network-context";

const Stack = createStackNavigator();

export default function ItemStack({ route, navigation }) {
  const { params } = route;
  return (
    <NetworkContext.Provider value={params}>
      <Stack.Navigator>
        <Stack.Screen name="Add Capacity" component={AddCapacityScreen} />
      </Stack.Navigator>
    </NetworkContext.Provider>
  );
}
