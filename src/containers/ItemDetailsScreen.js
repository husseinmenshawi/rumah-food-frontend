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

function ItemDetailsScreen({ navigation }) {
  const params = React.useContext(NetworkContext);
  const { item } = params;
  const itemActivity = item && item.isEnabled ? "Active" : "Inactive";

  const itemsRows = (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>
        Item Price: {item ? item.itemPrice : ""}
      </Text>
      <Text style={styles.itemText}>
        Item Description: {item ? item.itemDesc : ""}
      </Text>
      <Text style={styles.itemText}>Item Activity: {itemActivity}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>
          {item ? item.itemName : ""}
        </Text>
      </View>
      {item ? itemsRows : null}
      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity style={styles.addItem} onPress={handleLogout}> */}
        <TouchableOpacity style={styles.editItem}>
          <Text
            style={{ color: "white", alignSelf: "center", fontWeight: "bold" }}
          >
            Edit Item
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteItem}>
          <Text
            style={{ color: "white", alignSelf: "center", fontWeight: "bold" }}
          >
            Delete Item
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
    paddingTop: 20,
  },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 10,
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
    // backgroundColor: "blue",
    justifyContent: "center",
    paddingHorizontal: 30,
    flex: 1,
  },
  editItem: {
    alignItems: "center",
    backgroundColor: "#00008B",
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  deleteItem: {
    alignItems: "center",
    backgroundColor: "#b4151c",
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  error: {
    color: "red",
  },
});

export default ItemDetailsScreen;
