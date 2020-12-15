import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import ItemDetailsStack from "./ItemDetailsStack";
import AddItemStack from "./AddItemStack";
import EditProfileStack from "./EditProfileStack";
import AddCapacityStack from "./AddCapacityStack";
import OrderDetailsStack from "./OrderDetailsStack";
import BuyerOrderDetailsStack from "./BuyerOrderDetailsStack";
import KitchenDetailsStack from "./KitchenDetailsStack";
import SelectDateStack from "./SelectDateStack";
import AddOrderStack from "./AddOrderStack";
// import Loading from '../containers/Loading';

const Stack = createStackNavigator();

export const AppNavigator = (props) => (
  <Stack.Navigator {...props} headerMode="none">
    {/* <Stack.Screen name="Loading" component={Loading} /> */}
    <Stack.Screen name="Auth" component={AuthStack} />
    <Stack.Screen name="App" options={{ title: "Back" }} component={AppStack} />
    <Stack.Screen
      options={{ title: "Back" }}
      name="ItemDetails"
      component={ItemDetailsStack}
    />
    <Stack.Screen
      options={{ title: "Back" }}
      name="OrderDetails"
      component={OrderDetailsStack}
    />
    <Stack.Screen
      options={{ title: "Back" }}
      name="BuyerOrderDetails"
      component={BuyerOrderDetailsStack}
    />
    <Stack.Screen
      options={{ title: "Back" }}
      name="AddItem"
      component={AddItemStack}
    />
    <Stack.Screen
      options={{ title: "Back" }}
      name="EditProfile"
      component={EditProfileStack}
    />
    <Stack.Screen
      options={{ title: "Back" }}
      name="AddCapacity"
      component={AddCapacityStack}
    />
    <Stack.Screen
      options={{ title: "Back" }}
      name="KitchenDetails"
      component={KitchenDetailsStack}
    />
    <Stack.Screen
      options={{ title: "Back" }}
      name="SelectDate"
      component={SelectDateStack}
    />
        <Stack.Screen
      options={{ title: "Back" }}
      name="AddOrder"
      component={AddOrderStack}
    />
  </Stack.Navigator>
);

export default AppNavigator;
