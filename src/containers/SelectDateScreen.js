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
  Image,
} from "react-native";

import { NetworkContext } from "../../network-context";
import config from "../../config";

import _ from "lodash";
import moment from "moment";

function SelectDateScreen({ navigation }) {
  const params = React.useContext(NetworkContext);
  const { item, accessToken, userId } = params;
  const { kitchenId, id } = item;
  const [error, setError] = React.useState(null);
  const [rawCapacities, setRawCapacities] = React.useState([]);
  const [capacities, setCapacities] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const finalGroupedCapacities = [];

  React.useEffect(() => {
    if (rawCapacities.length == 0) {
      fetchCapacities();
    }
  }, []);

  React.useEffect(() => {
    handleRawCapacities();
  }, [rawCapacities]);

  React.useEffect(() => {
    if (error) {
      errorAlert();
      setError(null);
    }
  }, [error]);

  const fetchCapacities = () => {
    setLoading(true);
    fetch(
      `http://${config.ipAddress}:3000/api/v1.0/kitchen/capacities/item/${id}`,
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

  const errorAlert = () =>
    Alert.alert(
      "Error",
      `${error}`,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: true }
    );

  const handleRawCapacities = () => {
    const groupedCapacities = _.chain(rawCapacities)
      .groupBy(
        (x) => `${moment(x.date).format("YYYY-MM-DD")}_${x.kitchenItemId}`
      )
      .value();

    const capacityKeys = Object.keys(groupedCapacities);
    capacityKeys.forEach((key) => {
      const groupedCapacity = groupedCapacities[key];
      const availableCapacity = groupedCapacity.length;

      const obj = {
        itemUniqueKey: `${moment(groupedCapacity[0].date).format(
          "YYYY-MM-DD"
        )}_${groupedCapacity[0].itemName}`,
        itemName: groupedCapacity[0].itemName,
        itemId: groupedCapacity[0].id,
        kitchenId: groupedCapacity[0].kitchenId,
        date: groupedCapacity[0].date,
        day: moment(groupedCapacity[0].date).format("dddd"),
        availableCapacity,
      };
      finalGroupedCapacities.push(obj);
    });
    setCapacities(finalGroupedCapacities);
  };

  const handleCapacityOnClick = (capacity) => {
    navigation.navigate("AddOrder", {
      item,
      date: capacity.date,
      userId,
      accessToken
    });
  };

  const Capacity = ({ item }) => (
    <TouchableOpacity
      style={styles.activeItemContainer}
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
          <Text style={styles.primaryItemText}>{`${item.day}`}</Text>
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
          >{`${item.availableCapacity} `}</Text>
          <Text style={{ marginTop: 5 }}>left</Text>
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
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCapacity = ({ item }) => <Capacity item={item} />;
  const capacityRows = (
    <FlatList
      data={capacities}
      renderItem={renderCapacity}
      keyExtractor={(item) => item.itemUniqueKey}
    />
  );

  const loadingIndicator = (
    <View style={styles.loadingView}>
      <ActivityIndicator size="large" />
      <Text>Loading...</Text>
    </View>
  );

  const noCapacitiesPlaceHolder = (
    <View style={styles.noCapacitiesPlaceHolderView}>
      <Text style={{ fontSize: 20 }}> Sold out..</Text>
      <Text
        style={{
          fontSize: 15,
          paddingHorizontal: 30,
          textAlign: "center",
          paddingVertical: 5,
        }}
      >
        It seems, like the item you are craving for is sold it!
      </Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              alignSelf: "flex-start",
              paddingBottom: 20,
            }}
          >
            Availability for {item.itemName}
          </Text>
        </View>
        {loading
          ? loadingIndicator
          : capacities.length != 0
          ? capacityRows
          : noCapacitiesPlaceHolder}
      </View>
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
    flex: 0.5,
    paddingHorizontal: 30,
  },
  activeItemContainer: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 10,
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
  loadingView: {
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
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

export default SelectDateScreen;
