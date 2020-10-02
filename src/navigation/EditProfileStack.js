import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import EditProfileScreen from "../containers/EditProfileScreen";
import { NetworkContext } from "../../network-context";

const Stack = createStackNavigator();

export default function ItemStack({ route, navigation }) {
  const { params } = route;
  return (
    <NetworkContext.Provider value={params}>
      <Stack.Navigator>
        <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
      </Stack.Navigator>
    </NetworkContext.Provider>
  );
}
