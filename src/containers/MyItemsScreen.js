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
function MyItemsScreen({ navigation }) {
  const params = React.useContext(NetworkContext);
  const { accessToken, kitchenId } = params;
  const [error, setError] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const addIconDisabled = items.length === 10;

  React.useEffect(() => {
    if (items.length === 0) {
      fetchItems();
    }
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
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

  const fetchItems = () => {
    setLoading(true);
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
        setLoading(false);
        setItems(data);
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  const handleItemOnClick = (item) => {
    navigation.navigate("ItemDetails", {
      itemId: item.id,
      accessToken,
    });
  };

  const handleAddItem = () => {
    if (addIconDisabled) {
      Alert.alert(
        "Maximum items reached!",
        "You are only allowed to add 10 items!",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    } else {
      navigation.navigate("AddItem", {
        kitchenId,
        accessToken,
      });
    }
  };

  //TODO: Research more to check if this is the best practice
  const handleFetchItems = () => {
    fetchItems();
  };

  const Item = ({ item }) => (
    <TouchableOpacity
      style={
        item.isEnabled
          ? styles.activeItemContainer
          : styles.inactiveItemContainer
      }
      onPress={() => handleItemOnClick(item)}
    >
      <Text style={styles.itemText}>{item.itemName}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => <Item item={item} />;
  const itemsRows = (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );

  const loadingIndicator = (
    <View style={styles.loadingView}>
      <ActivityIndicator size="large" />
      <Text>Loading Items...</Text>
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
            My Items
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
            {items.length}
          </Text>
          <Text>/10</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={handleFetchItems}>
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
            flex: 0.6,
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity onPress={handleAddItem}>
            <Ionicons
              style={{ color: "black" }}
              name="ios-add-circle-outline"
              size={30}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
      {loading ? loadingIndicator : itemsRows}
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
});

export default MyItemsScreen;
