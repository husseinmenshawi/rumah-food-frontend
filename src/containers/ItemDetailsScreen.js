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

function ItemDetailsScreen({ navigation }) {
  // const chars =
  //   "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  // const Base64 = {
  //   btoa: (input = "") => {
  //     let str = input;
  //     let output = "";

  //     for (
  //       let block = 0, charCode, i = 0, map = chars;
  //       str.charAt(i | 0) || ((map = "="), i % 1);
  //       output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
  //     ) {
  //       charCode = str.charCodeAt((i += 3 / 4));

  //       if (charCode > 0xff) {
  //         throw new Error(
  //           "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
  //         );
  //       }

  //       block = (block << 8) | charCode;
  //     }

  //     return output;
  //   },
  // };
  const params = React.useContext(NetworkContext);
  const { itemId, accessToken } = params;
  const [error, setError] = React.useState(null);
  const [itemState, setItemState] = React.useState(null);
  // const [imageBuffer, setImageBuffer] = React.useState(null);
  const [itemFlavours, setItemFlavours] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const itemActivity = itemState && itemState.isEnabled ? "Active" : "Inactive";

  React.useEffect(() => {
    if (!itemState) {
      handleFetchItem();
    }
  }, []);

  // React.useEffect(() => {
  //   if (itemState) {
  //     const buffer = itemState.fileBuffer.data;
  //     let binary = "";
  //     let bytes = new Uint8Array(buffer);
  //     let len = bytes.byteLength;
  //     for (let i = 0; i < len; i++) {
  //       binary += String.fromCharCode(bytes[i]);
  //     }
  //     setImageBuffer(Base64.btoa(binary));
  //   }
  // }, [itemState]);

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
        setItemFlavours(data.Flavours);
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

  const Item = ({ item }) => (
    <Text style={styles.itemText}>{item.flavourName}</Text>
  );

  const renderItem = ({ item }) => <Item item={item} />;

  const itemsRows = (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>
        Item Price: {itemState ? itemState.itemPrice : ""}
      </Text>
      <Text style={styles.itemText}>
        Item Description: {itemState ? itemState.itemDesc : ""}
      </Text>
      <Text style={styles.itemText}>Item Activity: {itemActivity}</Text>
      <Text style={styles.itemText}>Flavours:</Text>
      {itemState
        ? itemState.Flavours.map((x) => {
            return (
              <Text
                key={x.id}
                style={styles.itemText}
              >{`- ${x.flavourName}`}</Text>
            );
          })
        : null}
      {/* <FlatList
        data={itemFlavours}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      /> */}
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>
          {itemState ? itemState.itemName : ""}
        </Text>
      </View>
      {itemState ? (
        <View style={styles.imageView}>
          {/* <Image
            style={styles.logo}
            source={{ uri: `data:image/jpeg;base64,${imageBuffer}` }}
          /> */}
          <Image style={styles.image} source={{ uri: itemState.fileUri }} />
        </View>
      ) : null}
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
            Edit Items
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
    // paddingTop: 50,
    // paddingBottom: 30,
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
  imageView: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginHorizontal: 30,
    marginVertical: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
  },
});

export default ItemDetailsScreen;
