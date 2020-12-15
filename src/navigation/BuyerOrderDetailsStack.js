import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BuyerOrderDetailsScreen from "../containers/BuyerOrderDetailsScreen";
import { NetworkContext } from "../../network-context";

const Stack = createStackNavigator();

export default function BuyerOrderDetailsStack({ route, navigation }) {
  const { params } = route;
  return (
    <NetworkContext.Provider value={params}>
      <Stack.Navigator>
        <Stack.Screen name="Order Details" component={BuyerOrderDetailsScreen} />
        {/* <Stack.Screen name="Edit Item" component={EditItemScreen} /> */}
      </Stack.Navigator>
    </NetworkContext.Provider>
  );
}
