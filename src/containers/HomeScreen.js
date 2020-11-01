import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { NetworkContext } from "../../network-context";
import config from "../../config";

function HomeScreen({ navigation }) {
  const params = React.useContext(NetworkContext);
  const { accessToken, roleId, kitchenId } = params;
  const roleName = roleId == 2 ? "Seller" : "Buyer";
  const [error, setError] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [rawCapacities, setRawCapacities] = React.useState([]);
  const [capacities, setCapacities] = React.useState([]);
  const [loadingItems, setLoadingItems] = React.useState(false);
  const [loadingCapacities, setLoadingCapacities] = React.useState(false);

  React.useEffect(() => {
    if (items.length === 0) {
      fetchItems();
    }
    if (rawCapacities.length === 0) {
      fetchCapacities();
    }
  }, []);

  // React.useEffect(() => {
  //   handleRawCapacities();
  // }, [rawCapacities]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchCapacities();
      fetchItems();
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

  const fetchCapacities = () => {
    setLoadingCapacities(true);
    fetch(
      `http://${config.ipAddress}:3000/api/v1.0/kitchen/capacities/me?kitchenId=${kitchenId}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLoadingCapacities(false);
        setRawCapacities(data);
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  const fetchItems = () => {
    setLoadingItems(true);
    fetch(
      `http://${config.ipAddress}:3000/api/v1.0/kitchen/item/me?kitchenId=${kitchenId}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLoadingItems(false);
        setItems(data);
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  const handleRawCapacities = () => {
    const groupedCapacities = _.chain(rawCapacities)
      .groupBy(
        (x) =>
          `${moment(x.startDateTime).format("YYYY-MM-DD")}_to_${moment(
            x.endDateTime
          ).format("YYYY-MM-DD")}_${x.KitchenItem.id}`
      )
      .value();

    const capacityKeys = Object.keys(groupedCapacities);
    capacityKeys.forEach((key) => {
      const groupedCapacity = groupedCapacities[key];
      const totalCapacity = groupedCapacity.length;
      const availableCapacity = groupedCapacity.filter((x) => {
        return !x.orderDateTime && !x.UserId;
      });

      const obj = {
        itemUniqueKey: `${moment(groupedCapacity[0].startDateTime).format(
          "YYYY-MM-DD"
        )}_to_${moment(groupedCapacity[0].endDateTime).format("YYYY-MM-DD")}_${
          groupedCapacity[0].KitchenItem.itemName
        }`,
        itemName: groupedCapacity[0].KitchenItem.itemName,
        itemId: groupedCapacity[0].KitchenItemId,
        kitchenId: groupedCapacity[0].kitchenId,
        startDateTime: groupedCapacity[0].startDateTime,
        endDateTime: groupedCapacity[0].endDateTime,
        singleDateTime:
          groupedCapacity[0].startDateTime == groupedCapacity[0].endDateTime
            ? true
            : false,
        totalCapacity,
        availableCapacity: availableCapacity.length,
      };
      finalGroupedCapacities.push(obj);
    });
    setCapacities(finalGroupedCapacities);
  };

  const getOrders = () => {
    const orders = rawCapacities.filter((x) => {
      return x.orderDateTime && x.UserId;
    });

    return orders.length;
  };

  const calculateSales = () => {
    const orders = rawCapacities.filter((x) => {
      return x.orderDateTime && x.UserId;
    });
    let totalSales = 0;
    for (let i = 0; i < orders.length; i++) {
      const item = items.find((x) => {
        return x.id == orders[i].kitchenItemId;
      });
      totalSales = totalSales + item.itemPrice;
    }

    return totalSales;
  };

  const calculateGoalSales = () => {
    let totalSales = 0;
    for (let i = 0; i < rawCapacities.length; i++) {
      const item = items.find((x) => {
        return x.id == rawCapacities[i].kitchenItemId;
      });
      totalSales = totalSales + item.itemPrice;
    }

    return totalSales;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"dark-content"} />
      <View style={styles.headerContainer}>
        <Text
          style={{ fontSize: 25, fontWeight: "bold", alignSelf: "flex-start" }}
        >
          Overview
        </Text>
      </View>
      <View style={styles.row}>
        <View style={styles.activeItemContainer}>
          <Text style={styles.overviewNumber}>
            {items.length > 0 ? items.length : 0}
          </Text>
          <Text>Items</Text>
        </View>
        <View style={styles.RightActiveItemContainer}>
          <Text style={styles.overviewNumber}>
            {rawCapacities.length > 0 ? rawCapacities.length : 0}
          </Text>
          <Text>Capacities</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.activeItemContainer}>
          <Text style={styles.overviewNumber}>{getOrders()}</Text>
          <Text>Order(s)</Text>
        </View>
        <View style={styles.RightActiveItemContainer}>
          <Text style={styles.overviewNumber}>{`RM ${calculateSales()}`}</Text>
          <Text>Sales</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.activeItemContainer}>
          <Text style={styles.overviewNumber}>
            {`RM ${calculateGoalSales()}`}
          </Text>
          <Text>Goal</Text>
        </View>
      </View>

      <View></View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // alignItems: "center",
    // justifyContent: "center",
  },
  error: {
    color: "red",
  },
  row: {
    flexDirection: "row",
  },
  activeItemContainer : {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
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
  RightActiveItemContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    marginLeft: 0,
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
  headerContainer: {
    flexDirection: "row",
    paddingTop: 100,
    paddingBottom: 10,
    paddingHorizontal: 30,
  },
  overviewNumber: {
    fontSize: 35,
    fontWeight: "bold",
  },
});

export default HomeScreen;
