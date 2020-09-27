import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import ItemDetailsStack from "./ItemDetailsStack";
import AddItemStack from "./AddItemStack";
// import Loading from '../containers/Loading';

const Stack = createStackNavigator();

export const AppNavigator = (props) => (
  <Stack.Navigator {...props} headerMode="none">
    {/* <Stack.Screen name="Loading" component={Loading} /> */}
    <Stack.Screen name="Auth" component={AuthStack} />
    <Stack.Screen
      name="App"
      options={{ title: "Items" }}
      component={AppStack}
    />
    <Stack.Screen name="ItemDetails" component={ItemDetailsStack} />
    <Stack.Screen name="AddItem" component={AddItemStack} />
  </Stack.Navigator>
);

export default AppNavigator;
