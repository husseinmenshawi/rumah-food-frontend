import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StartUpScreen from "../containers/StartUpScreen";
import SellerLoginScreen from "../containers/SellerLoginScreen";
import BuyerLoginScreen from "../containers/BuyerLoginScreen";
import SellerRegisterScreen from "../containers/SellerRegisterScreen";
import BuyerRegisterScreen from "../containers/BuyerRegisterScreen";

const Stack = createStackNavigator();

export const AuthStack = (props) => (
  <Stack.Navigator {...props} headerMode="none" initialRouteName="Start">
    <Stack.Screen
      name="Start"
      component={StartUpScreen}
      options={{ title: "User Type" }}
    />
    <Stack.Screen
      name="SellerLogin"
      component={SellerLoginScreen}
      options={{ title: "Seller Login" }}
    />
    <Stack.Screen
      name="BuyerLogin"
      component={BuyerLoginScreen}
      options={{ title: "Buyer Login" }}
    />
    <Stack.Screen
      name="SellerRegister"
      component={SellerRegisterScreen}
      options={{ title: "Seller Register" }}
    />
    <Stack.Screen
      name="BuyerRegister"
      component={BuyerRegisterScreen}
      options={{ title: "Buyer Register" }}
    />
    {/* <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: "Home" }}
      navigationOptions={{ header: null }}
    /> */}
  </Stack.Navigator>
);

export default AuthStack;
