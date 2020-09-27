import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ItemDetailsScreen from "../containers/ItemDetailsScreen";
import { NetworkContext } from "../../network-context";

const Stack = createStackNavigator();

export default function ItemStack({ route, navigation }) {
  const { params } = route;
  return (
    <NetworkContext.Provider value={params}>
      <Stack.Navigator>
        <Stack.Screen name="Item Details" component={ItemDetailsScreen} />
      </Stack.Navigator>
    </NetworkContext.Provider>
  );
}
