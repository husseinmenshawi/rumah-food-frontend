import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import OrderDetailsScreen from "../containers/OrderDetailsScreen";
// import EditItemScreen from "../containers/EditItemScreen";
import { NetworkContext } from "../../network-context";

const Stack = createStackNavigator();

export default function ItemStack({ route, navigation }) {
  const { params } = route;
  return (
    <NetworkContext.Provider value={params}>
      <Stack.Navigator>
        <Stack.Screen name="Order Details" component={OrderDetailsScreen} />
        {/* <Stack.Screen name="Edit Item" component={EditItemScreen} /> */}
      </Stack.Navigator>
    </NetworkContext.Provider>
  );
}
