import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import SellerHomeScreen from "../containers/HomeScreen";
import MyItemsScreen from "../containers/MyItemsScreen";
import ProfileScreen from "../containers/ProfileScreen";
import CapacitiesScreen from "../containers/CapacitiesScreen";
import OrdersScreen from "../containers/OrdersScreen";
import BuyerHomeScreen from "../containers/BuyerHomeScreen";
import BuyerOrdersScreen from "../containers/BuyerOrdersScreen";
// import LoadingScreen from "../containers/LoadingScreen";

import { NetworkContext } from "../../network-context";

const Tab = createBottomTabNavigator();

export default function App({ route, navigation }) {
  const { params } = route;
  const { roleId } = params;
  return (
    <NetworkContext.Provider value={params}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "ios-home";
            } else if (route.name === "My List") {
              iconName = "ios-list";
            } else if (route.name === "Profile") {
              iconName = "ios-person";
            } else if (route.name === "Capacities") {
              iconName = "md-calendar";
            } else if (route.name === "Orders" || route.name === "My Orders") {
              iconName = "ios-paper";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "black",
          inactiveTintColor: "gray",
        }}
      >
        {roleId === 2 && (
          <Tab.Screen name="Home" component={SellerHomeScreen} />
        )}

        {roleId === 2 && (
          <Tab.Screen name="Capacities" component={CapacitiesScreen} />
        )}
        {roleId === 2 && (
          <Tab.Screen name="My List" component={MyItemsScreen} />
        )}
        {roleId === 2 && <Tab.Screen name="Orders" component={OrdersScreen} />}
        {roleId === 3 && <Tab.Screen name="Home" component={BuyerHomeScreen} />}
        {roleId === 3 && (
          <Tab.Screen name="My Orders" component={BuyerOrdersScreen} />
        )}
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NetworkContext.Provider>
  );
}
