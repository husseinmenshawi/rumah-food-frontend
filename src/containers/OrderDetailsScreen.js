import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import moment from "moment";

import { NetworkContext } from "../../network-context";
import config from "../../config";

function OrderDetailsScreen({ navigation }) {
  const params = React.useContext(NetworkContext);
  const { orderId, accessToken } = params;
  const [error, setError] = React.useState(null);
  const [orderState, setOrderState] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!orderState) {
      handleFetchOrder();
    }
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      handleFetchOrder();
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    if (error) {
      errorAlert();
      setError(null);
    }
  }, [error]);

  const handleFetchOrder = () => {
    setLoading(true);
    fetch(`http://${config.ipAddress}:3000/api/v1.0/order/${orderId}`, {
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
        setOrderState(data);
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  const handleDeliverOrder = () => {
    Alert.alert(
      "Have you confirmed that the order was delivered?",
      "",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Yes", onPress: () => deliverOrder() },
      ],
      { cancelable: true }
    );
  };

  const handleConfirmOrder = () => {
    Alert.alert(
      "You are about to confirm this order.",
      `This will notify the customer that his/her order is confirmed`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Confirm", onPress: () => confirmOrder() },
      ],
      { cancelable: true }
    );
  };

  const deliverOrder = () => {
    fetch(`http://${config.ipAddress}:3000/api/v1.0/order/deliver/${orderId}`, {
      method: "patch",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 204) {
          Alert.alert(
            "The order has successfully been marked as delivered.",
            "",
            [
              {
                text: "Ok",
                onPress: () => {
                  navigation.goBack();
                },
              },
            ],
            { cancelable: true }
          );
        }
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  const confirmOrder = () => {
    fetch(`http://${config.ipAddress}:3000/api/v1.0/order/confirm/${orderId}`, {
      method: "patch",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 204) {
          Alert.alert(
            "The order has successfully been marked as confirmed.",
            "",
            [
              {
                text: "Ok",
                onPress: () => {
                  navigation.goBack();
                },
              },
            ],
            { cancelable: true }
          );
        }
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  const errorAlert = () =>
    Alert.alert(
      "Error",
      `${error}`,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: true }
    );

  const loadingIndicator = (
    <View style={styles.loadingView}>
      <ActivityIndicator size="large" />
      <Text>Loading order...</Text>
    </View>
  );

  const orderRows = (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>
        Ordered By: {orderState ? orderState.User.name : ""}
      </Text>
      <Text style={styles.itemText}>
        Email: {orderState ? orderState.User.email : ""}
      </Text>
      <Text style={styles.itemText}>
        Phone Number: {orderState ? orderState.User.phoneNumber : ""}
      </Text>
      <Text style={styles.itemText}>
        Amount: {orderState ? orderState.amount : ""}
      </Text>
      <Text style={styles.itemText}>
        Ordered Created:{" "}
        {orderState ? moment(orderState.createdAt).format("YYYY-MM-DD") : ""}
      </Text>
      <Text style={styles.itemText}>
        Ordered Due:{" "}
        {orderState
          ? moment(orderState.orderDateTime).format("YYYY-MM-DD")
          : ""}
      </Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>
          {orderState
            ? `${orderState.KitchenItem.itemName} (${orderState.Flavour.flavourName})`
            : ""}
        </Text>
      </View>
      {loading ? loadingIndicator : orderRows}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={
            orderState && orderState.OrderStatus.status == "Confirmed"
              ? styles.disabledConfirmOrderButton
              : styles.enabledConfirmOrderButton
          }
          disabled={
            orderState && orderState.OrderStatus.status == "Confirmed"
              ? true
              : false
          }
          onPress={handleConfirmOrder}
        >
          <Text
            style={{
              color: "white",
              alignSelf: "center",
              fontWeight: "bold",
            }}
          >
            Confirm Order
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            orderState &&
            (orderState.OrderStatus.status == "Delivered" ||
              orderState.OrderStatus.status == "Booked")
              ? styles.disabledDeliverOrderButton
              : styles.enabledDeliverOrderButton
          }
          disabled={
            orderState &&
            (orderState.OrderStatus.status == "Delivered" ||
              orderState.OrderStatus.status == "Booked")
              ? true
              : false
          }
          onPress={handleDeliverOrder}
        >
          <Text
            style={{
              color: "white",
              alignSelf: "center",
              fontWeight: "bold",
            }}
          >
            Mark order as Delivered
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 80,
  },
  headerContainer: {
    paddingHorizontal: 30,
  },
  itemContainer: {
    padding: 10,
    marginHorizontal: 30,
    marginVertical: 10,
    backgroundColor: "white",
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
    padding: 5,
    color: "black",
  },
  buttonContainer: {
    paddingVertical: 30,
    paddingHorizontal: 30,
    flex: 1,
  },
  enabledConfirmOrderButton: {
    alignItems: "center",
    backgroundColor: "#00008B",
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  disabledConfirmOrderButton: {
    alignItems: "center",
    backgroundColor: "#bdbdbd",
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  enabledDeliverOrderButton: {
    alignItems: "center",
    backgroundColor: "#006400",
    marginVertical: 5,
    marginBottom: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  disabledDeliverOrderButton: {
    alignItems: "center",
    backgroundColor: "#bdbdbd",
    marginVertical: 5,
    marginBottom: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  loadingView: {
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrderDetailsScreen;
