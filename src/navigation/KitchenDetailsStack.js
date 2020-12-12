import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import KitchenDetailsScreen from "../containers/KitchenDetailsScreen";
// import SelectDateScreen from "../containers/SelectDateScreen";
// import EditItemScreen from "../containers/EditItemScreen";
import { NetworkContext } from "../../network-context";

const Stack = createStackNavigator();

export default function KitchenDetailsStack({ route, navigation }) {
  const { params } = route;
  return (
    <NetworkContext.Provider value={params}>
      <Stack.Navigator>
        <Stack.Screen name="Kitchen Details" component={KitchenDetailsScreen} />
        {/* <Stack.Screen name="Select Date" component={SelectDateScreen} /> */}
        {/* <Stack.Screen name="Edit Item" component={EditItemScreen} /> */}
      </Stack.Navigator>
    </NetworkContext.Provider>
  );
}
