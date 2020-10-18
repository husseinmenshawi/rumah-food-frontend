import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import HomeScreen from "../containers/HomeScreen";
import MyItemsScreen from "../containers/MyItemsScreen";
import ProfileScreen from "../containers/ProfileScreen";
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
            } else if (route.name === "MyList") {
              iconName = "ios-list";
            } else if (route.name === "Profile") {
              iconName = "ios-person";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "black",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        {roleId === 2 && <Tab.Screen name="MyList" component={MyItemsScreen} />}
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NetworkContext.Provider>
  );
}
