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

import _ from "lodash";
import moment from "moment";
import Ionicons from "@expo/vector-icons/Ionicons";

function CapacitiesScreen({ navigation }) {
  const params = React.useContext(NetworkContext);
  const { accessToken, kitchenId } = params;
  const [error, setError] = React.useState(null);
  const [rawCapacities, setRawCapacities] = React.useState([]);
  const [capacities, setCapacities] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const finalGroupedCapacities = [];
  const today = moment().format("YYYY-MM-DD");

  React.useEffect(() => {
    if (capacities.length === 0) {
      fetchCapacities();
    }
  }, []);

  React.useEffect(() => {
    handleRawCapacities();
  }, [rawCapacities]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchCapacities();
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
    setLoading(true);
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
        setLoading(false);
        setRawCapacities(data);
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  const handleCapacityOnClick = (capacity) => {
    // navigation.navigate("ItemDetails", {
    //   capacityId: capacity.id,
    //   accessToken,
    // });
  };

  const handleAddCapacity = () => {
    navigation.navigate("AddCapacity", {
      kitchenId,
      accessToken,
    });
  };

  //TODO: Research more to check if this is the best practice
  const handleFetchCapacities = () => {
    fetchCapacities();
  };

  const handleRawCapacities = () => {
    const groupedCapacities = _.chain(rawCapacities)
      .groupBy(
        (x) => `${moment(x.date).format("YYYY-MM-DD")}_${x.KitchenItem.id}`
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
        itemUniqueKey: `${moment(groupedCapacity[0].date).format(
          "YYYY-MM-DD"
        )}_${groupedCapacity[0].KitchenItem.itemName}`,
        itemName: groupedCapacity[0].KitchenItem.itemName,
        itemId: groupedCapacity[0].KitchenItemId,
        kitchenId: groupedCapacity[0].kitchenId,
        date: groupedCapacity[0].date,
        // startDateTime: groupedCapacity[0].startDateTime,
        // endDateTime: groupedCapacity[0].endDateTime,
        // singleDateTime:
        //   groupedCapacity[0].startDateTime == groupedCapacity[0].endDateTime
        //     ? true
        //     : false,
        totalCapacity,
        availableCapacity: availableCapacity.length,
      };
      finalGroupedCapacities.push(obj);
    });
    setCapacities(finalGroupedCapacities);
  };

  const Capacity = ({ item }) => (
    <TouchableOpacity
      style={
        item.date > today
          ? styles.activeItemContainer
          : styles.inactiveItemContainer
      }
      onPress={() => handleCapacityOnClick(item)}
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
          <Text style={styles.primaryItemText}>{`${item.itemName}`}</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Text
            style={styles.availableCount}
          >{`${item.availableCapacity}`}</Text>
          <Text>{`/${item.totalCapacity}`}</Text>
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
          <Text style={styles.secondaryItemText}>{`Available on: ${moment(
            item.date
          ).format("YYYY-MM-DD")}`}</Text>
          {/* {item.singleDateTime ? (
            <Text style={styles.secondaryItemText}>{`Available on: ${moment(
              item.startDateTime
            ).format("YYYY-MM-DD")}`}</Text>
          ) : (
            <Text style={styles.secondaryItemText}>{`Available from: ${moment(
              item.startDateTime
            ).format("YYYY-MM-DD")} to: ${moment(item.endDateTime).format(
              "YYYY-MM-DD"
            )}`}</Text>
          )} */}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCapacity = ({ item }) => <Capacity item={item} />;
  const capacitiesRows = (
    <FlatList
      data={capacities}
      renderItem={renderCapacity}
      keyExtractor={(item) => item.itemUniqueKey}
    />
  );

  const loadingIndicator = (
    <View style={styles.loadingView}>
      <ActivityIndicator size="large" />
      <Text>Loading Capacities...</Text>
    </View>
  );

  const noCapacitiesPlaceHolder = (
    <View style={styles.noCapacitiesPlaceHolderView}>
      <Text style={{ fontSize: 20 }}> No Capacities..</Text>
      <Text
        style={{
          fontSize: 15,
          paddingHorizontal: 30,
          textAlign: "center",
          paddingVertical: 5,
        }}
      >
        To add a capacity, click on the plus icon on the top right..
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
            My Capacities
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={handleFetchCapacities}>
            <Ionicons
              style={{ color: "black" }}
              name="ios-refresh"
              size={30}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity onPress={handleAddCapacity}>
            <Ionicons
              style={{ color: "black" }}
              name="ios-add-circle-outline"
              size={30}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
      {loading
        ? loadingIndicator
        : capacities.length != 0
        ? capacitiesRows
        : noCapacitiesPlaceHolder}
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
  primaryItemText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
  },
  secondaryItemText: {
    fontSize: 12,
    fontStyle: "italic",
    color: "black",
  },
  availableCount: {
    fontSize: 25,
    fontWeight: "bold",
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
  noCapacitiesPlaceHolderView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CapacitiesScreen;
