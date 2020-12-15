import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";
import { Rating } from "react-native-elements";
import Ionicons from "@expo/vector-icons/Ionicons";

import moment from "moment";

import { NetworkContext } from "../../network-context";
import config from "../../config";

function BuyerOrderDetailsScreen({ navigation }) {
  const params = React.useContext(NetworkContext);
  const { orderId, accessToken } = params;
  const [error, setError] = React.useState(null);
  const [orderState, setOrderState] = React.useState(null);
  const [reviewState, setReviewState] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [reviewComment, setReviewComment] = React.useState("");

  React.useEffect(() => {
    if (!orderState) {
      handleFetchOrder();
    }
    if (!reviewState) {
      handleFetchReview();
    }
  }, []);

  React.useEffect(() => {
    if (error) {
      errorAlert();
      setError(null);
    }
  }, [error]);

  const handleFetchOrder = () => {
    setLoading(true);
    fetch(`http://${config.ipAddress}:3000/api/v1.0/order/${orderId}`, {
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
        setOrderState(data);
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  const handleFetchReview = () => {
    fetch(`http://${config.ipAddress}:3000/api/v1.0/review/${orderId}`, {
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
        setReviewState(data);
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  const addReview = () => {
    fetch(`http://${config.ipAddress}:3000/api/v1.0/review`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stars: rating,
        comment: reviewComment,
        orderId: orderState.id,
        kitchenId: orderState.KitchenItem.kitchenId,
        kitchenItemId: orderState.KitchenItem.id,
      }),
    })
      .then((res) => {
        if (res.status === 201) {
          Alert.alert(
            "Thank you for your feedback!",
            "This will help us improve our service!",
            [
              {
                text: "Ok",
                onPress: () => {
                  setShowModal(false);
                  navigation.goBack();
                },
              },
            ],
            { cancelable: true }
          );
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
      <Text>Loading order...</Text>
    </View>
  );

  const orderRows = (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>
        Ordered By: {orderState ? orderState.User.name : ""}
      </Text>
      <Text style={styles.itemText}>
        Email: {orderState ? orderState.User.email : ""}
      </Text>
      <Text style={styles.itemText}>
        Phone Number: {orderState ? orderState.User.phoneNumber : ""}
      </Text>
      <Text style={styles.itemText}>
        Amount: {orderState ? orderState.amount : ""}
      </Text>
      <Text style={styles.itemText}>
        Remarks: {orderState ? orderState.comment : ""}
      </Text>
      <Text style={styles.itemText}>
        Ordered Status: {orderState ? orderState.OrderStatus.status : ""}
      </Text>
      <Text style={styles.itemText}>
        Ordered Created:{" "}
        {orderState ? moment(orderState.createdAt).format("YYYY-MM-DD") : ""}
      </Text>
      <Text style={styles.itemText}>
        Ordered Due:{" "}
        {orderState
          ? moment(orderState.orderDateTime).format("YYYY-MM-DD")
          : ""}
      </Text>
    </View>
  );

  const submitReview = () => {
    addReview();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>
          {orderState
            ? `${orderState.KitchenItem.itemName} (${orderState.Flavour.flavourName})`
            : ""}
        </Text>
      </View>
      {loading ? loadingIndicator : orderRows}
      <View style={styles.reviewContainer}>
        <View
          style={{
            flex: 0.9,
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 20 }}>Let us know your feedback!</Text>
        </View>
        <TouchableOpacity
          style={styles.reviewIcon}
          disabled={
            orderState &&
            orderState.OrderStatus.status == "Delivered" &&
            !orderState.reviewComment
              ? false
              : true
          }
          onPress={() => {
            setShowModal(true);
          }}
        >
          <Ionicons
            name="md-create"
            size={30}
            color={
              orderState &&
              orderState.OrderStatus.status == "Delivered" &&
              !orderState.reviewComment
                ? "#000"
                : "#bdbdbd"
            }
          ></Ionicons>
        </TouchableOpacity>
        <Modal animationType="slide" transparent={false} visible={showModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{ paddingVertical: 20 }}>Rate your order:</Text>
              <Rating
                startingValue={rating}
                ratingCount={5}
                imageSize={30}
                onFinishRating={(rating) => setRating(rating)}
              />
              <Text style={{ paddingVertical: 20 }}>Leave a review:</Text>
              <TextInput
                multiline={true}
                style={styles.textInput}
                onChangeText={(text) => setReviewComment(text)}
                defaultValue={reviewComment}
              />
              <View
                style={{
                  flexDirection: "row",
                  width: 200,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => {
                    setShowModal(!showModal);
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      paddingHorizontal: 10,
                    }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    reviewComment.length != 0
                      ? styles.enabledModalSubmitButton
                      : styles.disabledModalSubmitButton
                  }
                  disabled={reviewComment.length != 0 ? false : true}
                  onPress={submitReview}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      paddingHorizontal: 30,
                    }}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.reviewSubHeader}>
        <Text>Give us a rating as soon as you received your order!</Text>
      </View>
      {reviewState && reviewState.comment ? (
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "flex-start",
            paddingHorizontal: 30,
            paddingTop: 10,
          }}
        >
          <Text style={{ paddingTop: 4, paddingRight: 10 }}>
            Ratings given:
          </Text>
          <Rating
            readonly
            startingValue={reviewState ? reviewState.stars : 0}
            ratingCount={5}
            imageSize={20}
          />
        </View>
      ) : null}

      {reviewState && reviewState.comment ? (
        <View style={styles.reviewContent}>
          <Text style={{ fontWeight: "bold" }}>
            {orderState ? `${orderState.User.name}: ` : ``}
          </Text>
          <Text style={{ padding: 10 }}>{` " ${reviewState.comment} " `}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 80,
  },
  headerContainer: {
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
  reviewContainer: {
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 30,
    flexDirection: "row",
  },
  reviewIcon: {
    flex: 0.1,
    padding: 5,
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 100,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  reviewSubHeader: {
    padding: 5,
    backgroundColor: "white",
    paddingHorizontal: 30,
  },
  reviewContent: {
    paddingVertical: 30,
    marginVertical: 20,
    marginHorizontal: 30,
    paddingHorizontal: 30,
    backgroundColor: "#d6d6d6",
    borderRadius: 30,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  loadingView: {
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginHorizontal: 5,
    width: 200,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 200,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 50,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalCloseButton: {
    paddingVertical: 10,
    backgroundColor: "#b4151c",
    borderRadius: 20,
    marginHorizontal: 10,
  },
  enabledModalSubmitButton: {
    paddingVertical: 10,
    backgroundColor: "#006400",
    borderRadius: 20,
    marginHorizontal: 10,
  },
  disabledModalSubmitButton: {
    paddingVertical: 10,
    backgroundColor: "#bdbdbd",
    borderRadius: 20,
    marginHorizontal: 10,
  },
});

export default BuyerOrderDetailsScreen;
