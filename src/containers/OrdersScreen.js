import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NetworkContext } from "../../network-context";
import config from "../../config";

import Ionicons from "@expo/vector-icons/Ionicons";
//TODO: whenever an item is click a warning is shown:  Failed child context type: Invalid child context `virtualizedCell.cellKey` of type `number` supplied to `CellRenderer`, expected `string`.
function OrdersScreen({ navigation }) {
  const params = React.useContext(NetworkContext);
  const { accessToken, kitchenId } = params;
  const [error, setError] = React.useState(null);
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (orders.length === 0) {
      fetchOrders();
    }
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchOrders();
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    if (error) {
      Alert.alert(
        "Error",
        `${error}`,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
  }, [error]);

  const fetchOrders = () => {
    setLoading(true);
    fetch(`http://${config.ipAddress}:3000/api/v1.0/order/me`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        setOrders(data);
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  const handleOrderOnClick = (item) => {
    navigation.navigate("OrderDetails", {
      orderId: item.id,
      accessToken,
    });
  };

  const Item = ({ item }) => (
    <TouchableOpacity
      style={styles.activeItemContainer}
      onPress={() => handleOrderOnClick(item)}
    >
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Text style={styles.itemText}>{item.KitchenItem.itemName}</Text>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {item.OrderStatus.status == "Booked" && (
              <Ionicons name="ios-time" size={40} color="#e3be64" />
            )}
            {item.OrderStatus.status == "Confirmed" && (
              <Ionicons
                name="ios-checkmark-circle-outline"
                size={40}
                color="green"
              />
            )}
            {item.OrderStatus.status == "Delivered" && (
              <Ionicons name="ios-checkmark-circle" size={40} color="green" />
            )}
          </View>
        </View>
      </View>

      <Text style={styles.itemSubText}>Ordered By: {item.User.name}</Text>
      <Text style={styles.itemSubText}>
        Order status: {item.OrderStatus.status}
      </Text>
    </TouchableOpacity>
  );

  const renderOrder = ({ item }) => <Item item={item} />;
  const ordersRows = (
    <FlatList
      data={orders}
      renderItem={renderOrder}
      keyExtractor={(item) => item.id}
    />
  );

  const loadingIndicator = (
    <View style={styles.loadingView}>
      <ActivityIndicator size="large" />
      <Text>Loading Orders...</Text>
    </View>
  );

  const noOrdersPlaceHolder = (
    <View style={styles.noOrdersPlaceHolder}>
      <Text style={{ fontSize: 20 }}> No Orders..</Text>
      <Text
        style={{
          fontSize: 15,
          paddingHorizontal: 30,
          textAlign: "center",
          paddingVertical: 5,
        }}
      >
        To get more orders, make sure you created capacities for your items..
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              alignSelf: "flex-start",
            }}
          >
            Orders
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>
            ({orders.length})
          </Text>
          {/* <Text>/10</Text> */}
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        ></View>
        <View
          style={{
            flex: 0.6,
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        ></View>
      </View>
      {loading
        ? loadingIndicator
        : orders.length != 0
        ? ordersRows
        : noOrdersPlaceHolder}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    paddingTop: 100,
    paddingBottom: 10,
    paddingHorizontal: 30,
  },
  activeItemContainer: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 30,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  inactiveItemContainer: {
    backgroundColor: "white",
    opacity: 0.3,
    padding: 20,
    marginHorizontal: 30,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  itemText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
    paddingBottom: 5,
  },
  itemSubText: {
    fontSize: 12,
    fontStyle: "italic",
    color: "black",
  },
  buttonContainer: {
    justifyContent: "flex-end",
    paddingHorizontal: 30,
    flex: 1,
  },
  addItem: {
    alignItems: "center",
    backgroundColor: "#006400",
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  error: {
    color: "red",
  },
  loadingView: {
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  noOrdersPlaceHolder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrdersScreen;
