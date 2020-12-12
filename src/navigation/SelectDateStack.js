import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SelectDateScreen from "../containers/SelectDateScreen";
// import AddOrderScreen from "../containers/AddOrderScreen";
import { NetworkContext } from "../../network-context";

const Stack = createStackNavigator();

export default function MakeOrderStack({ route, navigation }) {
  const { params } = route;
  return (
    <NetworkContext.Provider value={params}>
      <Stack.Navigator>
        <Stack.Screen name="Select Date" component={SelectDateScreen} />
        {/* <Stack.Screen name="Add Order" component={AddOrderScreen} /> */}
      </Stack.Navigator>
    </NetworkContext.Provider>
  );
}
