import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
  ImageBackground,
} from "react-native";

function StartUpScreen({ navigation }) {
  const navigateSellerScreen = () => {
    navigation.navigate("SellerLogin");
  };
  const navigateBuyerScreen = () => {
    navigation.navigate("BuyerLogin");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"dark-content"} />
      <View style={styles.topView}>
        <Image style={styles.logo} source={require("../../assets/logo.png")} />
      </View>
      <View style={styles.middleView}>
        <TouchableOpacity
          style={styles.sellerView}
          onPress={navigateSellerScreen}
        >
          <Text style={styles.text}>SELLER</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buyerView}
          onPress={navigateBuyerScreen}
        >
          <Text style={styles.text}>BUYER</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomView}>
        <Text style={styles.bottomTextOne}> Developed By:</Text>
        <Text style={styles.bottomTextTwo}> مكاش بلاصة</Text>
      </View>
      {/* <TouchableOpacity
        style={styles.sellerTouchable}
        onPress={navigateSellerScreen}
      >
        <View>
          <Text style={styles.text}>SELLER</Text>
        </View>
      </TouchableOpacity> */}
      {/* <TouchableOpacity
        style={styles.buyerTouchable}
        onPress={navigateBuyerScreen}
      >
        <View>
          <Text style={styles.text}>BUYER</Text>
        </View>
      </TouchableOpacity> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
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
  topView: {
    flex: 0.4,
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#FBED19",
  },
  logo: {
    height: 150,
    width: 130,
  },
  middleView: {
    flex: 0.3,
    flexDirection: "row",
  },
  sellerView: {
    flex: 1,
    backgroundColor: "#FBED19",
    paddingTop: 80,
    alignItems: "center",
  },
  buyerView: {
    flex: 1,
    backgroundColor: "#FBED19",
    paddingTop: 80,
    alignItems: "center",
  },
  bottomView: {
    flex: 0.3,
    backgroundColor: "#FBED19",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomTextOne: {
    fontSize: 20,
    color: "black",
    // fontWeight: "bold",
  },
  bottomTextTwo: {
    fontSize: 15,
    color: "black",
    // fontWeight: "bold",
  },
});

export default StartUpScreen;
