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
import _ from "lodash";

function BuyerHomeScreen({ navigation }) {
  const params = React.useContext(NetworkContext);
  const { accessToken, roleId, userId } = params;
  const roleName = roleId == 2 ? "Seller" : "Buyer";
  const [error, setError] = React.useState(null);
  const [kitchens, setKitchens] = React.useState([]);
  const [loadingKitchens, setLoadingKitchens] = React.useState(false);

  React.useEffect(() => {
    if (kitchens.length === 0) {
      fetchKitchens();
    }
    // if (rawCapacities.length === 0) {
    //   fetchCapacities();
    // }
    // if (orders.length === 0) {
    //   fetchOrders();
    // }
  }, []);

  // React.useEffect(() => {
  //   handleRawCapacities();
  // }, [rawCapacities]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchKitchens();
      // fetchItems();
      // fetchOrders();
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

  const fetchKitchens = () => {
    setLoadingKitchens(true);
    fetch(`http://${config.ipAddress}:3000/api/v1.0/kitchen`, {
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
        setLoadingKitchens(false);
        setKitchens(data);
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  // const fetchCapacities = () => {
  //   setLoading(true);
  //   fetch(
  //     `http://${config.ipAddress}:3000/api/v1.0/kitchen/capacities/me?kitchenId=${kitchenId}`,
  //     {
  //       method: "get",
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   )
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setLoading(false);
  //       setRawCapacities(data);
  //     })
  //     .catch((e) => {
  //       setError("Some server error!");
  //       throw new Error("Server Error", e);
  //     });
  // };

  // const handleRawCapacities = () => {
  //   const groupedCapacities = _.chain(rawCapacities)
  //     .groupBy(
  //       (x) =>
  //         `${moment(x.startDateTime).format("YYYY-MM-DD")}_to_${moment(
  //           x.endDateTime
  //         ).format("YYYY-MM-DD")}_${x.KitchenItem.id}`
  //     )
  //     .value();

  //   const capacityKeys = Object.keys(groupedCapacities);
  //   capacityKeys.forEach((key) => {
  //     const groupedCapacity = groupedCapacities[key];
  //     const totalCapacity = groupedCapacity.length;
  //     const availableCapacity = groupedCapacity.filter((x) => {
  //       return !x.orderDateTime && !x.UserId;
  //     });

  //     const obj = {
  //       itemUniqueKey: `${moment(groupedCapacity[0].startDateTime).format(
  //         "YYYY-MM-DD"
  //       )}_to_${moment(groupedCapacity[0].endDateTime).format("YYYY-MM-DD")}_${
  //         groupedCapacity[0].KitchenItem.itemName
  //       }`,
  //       itemName: groupedCapacity[0].KitchenItem.itemName,
  //       itemId: groupedCapacity[0].KitchenItemId,
  //       kitchenId: groupedCapacity[0].kitchenId,
  //       startDateTime: groupedCapacity[0].startDateTime,
  //       endDateTime: groupedCapacity[0].endDateTime,
  //       singleDateTime:
  //         groupedCapacity[0].startDateTime == groupedCapacity[0].endDateTime
  //           ? true
  //           : false,
  //       totalCapacity,
  //       availableCapacity: availableCapacity.length,
  //     };
  //     finalGroupedCapacities.push(obj);
  //   });
  //   setCapacities(finalGroupedCapacities);
  // };

  const handleKitchenOnClick = (item) => {
    navigation.navigate("KitchenDetails", {
      kitchenId: item.id,
      accessToken,
      userId
    });
  };

  const Item = ({ item }) => (
    <TouchableOpacity
      style={styles.activeItemContainer}
      onPress={() => handleKitchenOnClick(item)}
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
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Text style={styles.itemSubText}>Items: {item.itemsCount}</Text>
        </View>
      </View>

      {/* <Text style={styles.itemSubText}>
        Order status: {item.OrderStatus.status}
      </Text> */}
    </TouchableOpacity>
  );

  const renderKitchen = ({ item }) => <Item item={item} />;
  const kitchenRows = (
    <FlatList
      data={kitchens}
      renderItem={renderKitchen}
      keyExtractor={(item) => item.id}
    />
  );

  const loadingIndicator = (
    <View style={styles.loadingView}>
      <ActivityIndicator size="large" />
      <Text>Loading Kitchens...</Text>
    </View>
  );

  const noKitchensPlaceHolder = (
    <View style={styles.noKitchensPlaceHolder}>
      <Text style={{ fontSize: 20 }}> No Kitchens..</Text>
      <Text
        style={{
          fontSize: 15,
          paddingHorizontal: 30,
          textAlign: "center",
          paddingVertical: 5,
        }}
      >
        Please wait for more kitchens to be added to the system.
      </Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <StatusBar barStyle={"dark-content"} />
      <View style={styles.headerContainer}>
        <Text
          style={{ fontSize: 25, fontWeight: "bold", alignSelf: "flex-start" }}
        >
          Kitchens
        </Text>
      </View>
      {loadingKitchens
        ? loadingIndicator
        : kitchens.length != 0
        ? kitchenRows
        : noKitchensPlaceHolder}
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
  activeItemContainer: {
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
  headerContainer: {
    flexDirection: "row",
    paddingTop: 100,
    paddingBottom: 10,
    paddingHorizontal: 30,
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
  loadingView: {
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  noKitchensPlaceHolder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BuyerHomeScreen;
