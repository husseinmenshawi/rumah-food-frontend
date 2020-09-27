import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";

function StartUpScreen({ navigation }) {
  const navigateSellerScreen = () => {
    navigation.navigate("SellerLogin");
  };
  const navigateBuyerScreen = () => {
    navigation.navigate("BuyerLogin");
  };
  const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );

  return (
    <View style={styles.container}>
      <MyStatusBar backgroundColor="#5E8D48" barStyle="light-content" />
      <TouchableOpacity
        style={styles.sellerTouchable}
        onPress={navigateSellerScreen}
      >
        <View>
          <Text style={styles.text}>SELLER</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buyerTouchable}
        onPress={navigateBuyerScreen}
      >
        <View>
          <Text style={styles.text}>BUYER</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
  },
  sellerTouchable: {
    flex: 1,
    backgroundColor: "#CCCC00",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  buyerTouchable: {
    flex: 1,
    backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  text: {
    fontSize: 40,
    color: "black",
    fontWeight: "bold",
  },
  statusBar: {
    height: Platform.OS === "ios" ? 20 : StatusBar.currentHeight,
  },
});

export default StartUpScreen;
