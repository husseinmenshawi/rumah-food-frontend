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

import { Rating } from "react-native-elements";
import { NetworkContext } from "../../network-context";
import config from "../../config";

function KitchenDetailsScreen({ navigation }) {
  const params = React.useContext(NetworkContext);
  const { kitchenId, accessToken, userId } = params;
  const [error, setError] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [kitchenState, setKitchenState] = React.useState(null);
  // const [imageBuffer, setImageBuffer] = React.useState(null);
  // const [itemFlavours, setItemFlavours] = React.useState([]);
  const [loadingKitchen, setKitchenLoading] = React.useState(false);
  const [loadingItems, setItemsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!kitchenState) {
      fetchKitchen();
    }
    if (items.length == 0) {
      fetchItems();
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

  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     handleFetchItem();
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  React.useEffect(() => {
    if (error) {
      errorAlert();
      setError(null);
    }
  }, [error]);

  const fetchKitchen = () => {
    setKitchenLoading(true);
    fetch(`http://${config.ipAddress}:3000/api/v1.0/kitchen/one/${kitchenId}`, {
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
        setKitchenLoading(false);
        setKitchenState(data);
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  const fetchItems = () => {
    setItemsLoading(true);
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
        setItemsLoading(false);
        setItems(data);
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

  const handleItemOnClick = (item) => {
    navigation.navigate("SelectDate", {
      item,
      accessToken,
      userId,
    });
  };

  const Item = ({ item }) => (
    <TouchableOpacity
      style={styles.activeItemContainer}
      onPress={() => handleItemOnClick(item)}
    >
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Image style={styles.image} source={{ uri: item.fileUri }} />
          <Rating
            readonly
            startingValue={item ? item.reviewAverage : 0}
            ratingCount={5}
            imageSize={20}
            fractions={1}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Text style={styles.priceText}>{`RM ${item.itemPrice}`}</Text>
          <Text style={styles.itemText}>{item.itemName}</Text>
          <Text style={styles.itemText}>{`"${item.itemDesc}"`}</Text>
          <Text style={styles.itemText}>Flavours: </Text>
          {item.Flavours.map((x) => {
            return (
              <Text
                key={x.id}
                style={styles.itemText}
              >{`- ${x.flavourName}`}</Text>
            );
          })}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => <Item item={item} />;

  const itemsRows = (
    <FlatList
      style={{ paddingBottom: 50 }}
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

  const noItemsPlaceHolder = (
    <View style={styles.noItemsPlaceHolder}>
      <Text style={{ fontSize: 20 }}> No Items..</Text>
      <Text
        style={{
          fontSize: 15,
          paddingHorizontal: 30,
          textAlign: "center",
          paddingVertical: 5,
        }}
      >
        It seems like this kitchen does not have any items available yet.
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
              paddingBottom: 20,
            }}
          >
            {kitchenState ? kitchenState.name : "Loading Kitchen.."}
          </Text>
        </View>
        {loadingItems
          ? loadingIndicator
          : items.length != 0
          ? itemsRows
          : noItemsPlaceHolder}
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
  itemText: {
    fontSize: 15,
    paddingBottom: 2,
    color: "black",
    fontStyle: "italic",
  },
  priceText: {
    fontSize: 15,
    // padding: 5,
    color: "black",
    fontStyle: "italic",
    fontWeight: "bold",
  },
  buttonContainer: {
    justifyContent: "center",
    paddingHorizontal: 30,
    flex: 1,
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
    width: 110,
    height: 110,
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 10,
  },
  noItemsPlaceHolder: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default KitchenDetailsScreen;
