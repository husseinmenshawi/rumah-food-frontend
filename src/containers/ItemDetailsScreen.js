import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NetworkContext } from "../../network-context";
import config from "../../config";

function ItemDetailsScreen({ navigation }) {
  const params = React.useContext(NetworkContext);
  const { itemId, accessToken } = params;
  const [error, setError] = React.useState(null);
  const [itemState, setItemState] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const itemActivity = itemState && itemState.isEnabled ? "Active" : "Inactive";

  React.useEffect(() => {
    if (!itemState) {
      handleFetchItem();
    }
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      handleFetchItem();
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    if (error) {
      errorAlert();
      setError(null);
    }
  }, [error]);

  const handleFetchItem = () => {
    setLoading(true);
    fetch(`http://${config.ipAddress}:3000/api/v1.0/kitchen/item/${itemId}`, {
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
        setItemState(data);
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  const handleDeleteItem = () => {
    Alert.alert(
      "Are you sure you want delete this item?",
      `This will permanently delete the item`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Yes", onPress: () => deleteItem() },
      ],
      { cancelable: true }
    );
  };

  const handleEditItem = () => {
    navigation.navigate("Edit Item");
  };

  const deleteItem = () => {
    fetch(`http://${config.ipAddress}:3000/api/v1.0/kitchen/item/${itemId}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 204) {
          navigation.goBack();
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
      <Text>Loading Item...</Text>
    </View>
  );
  const itemsRows = (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>
        Item Price: {itemState ? itemState.itemPrice : ""}
      </Text>
      <Text style={styles.itemText}>
        Item Description: {itemState ? itemState.itemDesc : ""}
      </Text>
      <Text style={styles.itemText}>Item Activity: {itemActivity}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>
          {itemState ? itemState.itemName : ""}
        </Text>
      </View>
      {loading ? loadingIndicator : itemsRows}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editItem} onPress={handleEditItem}>
          <Text
            style={{
              color: "white",
              alignSelf: "center",
              fontWeight: "bold",
            }}
          >
            Edit Item
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteItem} onPress={handleDeleteItem}>
          <Text
            style={{
              color: "white",
              alignSelf: "center",
              fontWeight: "bold",
            }}
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
  loadingView: {
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ItemDetailsScreen;
