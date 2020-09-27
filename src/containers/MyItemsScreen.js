import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { NetworkContext } from "../../network-context";
import config from "../../config";

import Ionicons from "@expo/vector-icons/Ionicons";

function MyItemsScreen({ navigation }) {
  const params = React.useContext(NetworkContext);
  const { accessToken, kitchenId } = params;
  const [error, setError] = React.useState(null);
  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
    if (items.length === 0) {
      fetchItems();
    }
  }, []);
  const fetchItems = () => {
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
        setItems(data);
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  const handleItemOnClick = (item) => {
    navigation.navigate("ItemDetails", {
      item,
    });
  };

  const handleAddItem = () => {
    navigation.navigate("AddItem", {
      kitchenId,
      accessToken,
    });
  };

  const Item = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
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
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity onPress={handleAddItem}>
            <Ionicons name="ios-add-circle-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {items.length !== 0 ? itemsRows : null}
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
    // justifyContent: "flex-end",
    paddingTop: 100,
    paddingBottom: 10,
    paddingHorizontal: 30,
  },
  itemContainer: {
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
});

export default MyItemsScreen;
