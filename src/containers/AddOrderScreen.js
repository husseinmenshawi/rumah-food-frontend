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
  TextInput,
  Button,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import * as yup from "yup";

import { NetworkContext } from "../../network-context";
import config from "../../config";

import _ from "lodash";
import moment from "moment";

function AddOrderScreen({ navigation }) {
  const params = React.useContext(NetworkContext);
  const { item, date, accessToken, userId } = params;
  const [flavours, setFlavours] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [selectedFlavour, setSelectedFlavour] = React.useState();
  const [showflavourDropDown, setShowFlavourDropDown] = React.useState(false);

  React.useEffect(() => {
    // console.log("ITEMS", item);
    if (flavours.length == 0) {
      fetchItemFlavours();
    }
  }, []);

  React.useEffect(() => {
    console.log("FLAVOURS", flavours);
  }, [flavours]);

  React.useEffect(() => {
    if (flavours.length != 0) {
      setSelectedFlavour(flavours[0].id);
    }
  }, [flavours]);

  React.useEffect(() => {
    if (error) {
      errorAlert();
      setError(null);
    }
  }, [error]);

  const errorAlert = () =>
    Alert.alert(
      "Error",
      `${error}`,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: true }
    );

  const fetchItemFlavours = () => {
    fetch(
      `http://${config.ipAddress}:3000/api/v1.0/kitchen/flavours/item/${item.id}`,
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
        const defaultObj = {
          Flavour: {
            flavourName: "Non Selected",
            id: -1,
            key: -1,
          },
        };
        data.unshift(defaultObj);
        setFlavours(data);
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  const handleAddOrder = (values, actions) => {
    const { orderDateTime, kitchenItemId, amount, comment, flavourId } = values;
    console.log("VALUES", values);
    console.log("token", accessToken);
    console.log("USER ID", userId);

    fetch(`http://${config.ipAddress}:3000/api/v1.0/order`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderDateTime,
        kitchenItemId,
        amount: Number(amount),
        comment,
        flavourId: Number(flavourId),
        userId,
      }),
    })
      .then((res) => {
        if (res.status === 201) {
          navigation.navigate("My Orders", {
            accessToken,
          });
        } else if (res.status !== 201) {
          console.log(res.status);
          throw new Error("Unsuccessful Adding of order");
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const initialValues = {
    orderDateTime: moment(date).format("YYYY-MM-DD"),
    amount: "1",
    kitchenItemId: item.id,
    comment: "",
    flavourId: selectedFlavour,
  };

  const validationSchema = yup.object().shape({
    orderDateTime: yup.string().required("Order date is required"),
    amount: yup.number().required("Amount is required"),
    kitchenItemId: yup.string().required("Kitchen Item is required"),
    flavourId: yup.number().required("Please select a flavour"),
  });

  const getFlavourName = (id) => {
    if (flavours.length == 0) {
      return;
    } else {
      const flavour = flavours.find((x) => {
        return x.Flavour.id == id;
      });

      return flavour ? flavour.Flavour.flavourName : "Non Selected";
    }
  };
  return (
    <ScrollView style={styles.background}>
      <View style={styles.container}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            handleAddOrder(values, actions);
          }}
          validationSchema={validationSchema}
        >
          {(formikProps) => (
            <View style={styles.addItemContainer}>
              <Text style={styles.text}>Order date</Text>
              <TextInput
                style={styles.dateTextInput}
                onChangeText={formikProps.handleChange("orderDateTime")}
                value={formikProps.values.orderDateTime}
                editable={false}
              />
              <Text style={styles.inputError}>
                {formikProps.touched.orderDateTime &&
                  formikProps.errors.orderDateTime}
              </Text>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View
                  style={{
                    flex: 0.7,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text}>{`Flavour: ${getFlavourName(
                    selectedFlavour
                  )}`}</Text>
                </View>
                <View
                  style={{
                    flex: 0.3,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={styles.selectDateButton}
                    onPress={() => setShowFlavourDropDown(true)}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 11,
                        color: "white",
                      }}
                    >
                      Select Flavour
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.inputError}>
                {formikProps.touched.kitchenItemId &&
                  formikProps.errors.kitchenItemId}
              </Text>
              {showflavourDropDown && (
                <View>
                  <Picker
                    selectedValue={selectedFlavour}
                    style={{ height: 200 }}
                    onValueChange={(itemValue, itemIndex) => {
                      setSelectedFlavour(itemValue);
                      formikProps.setFieldValue("flavourId", itemValue);
                    }}
                  >
                    {flavours.length != 0 &&
                      flavours.map((x) => {
                        return (
                          <Picker.Item
                            label={`${x.Flavour.flavourName}`}
                            value={`${x.Flavour.id}`}
                            key={`${x.Flavour.id}`}
                          />
                        );
                      })}
                  </Picker>
                  <Button
                    onPress={() => setShowFlavourDropDown(false)}
                    title="Done"
                  />
                </View>
              )}
              <Text style={styles.inputError}>
                {formikProps.touched.flavourId && formikProps.errors.flavourId}
              </Text>
              <Text style={styles.text}>Amount</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={formikProps.handleChange("amount")}
                keyboardType={"numeric"}
                value={formikProps.values.amount}
              />
              <Text style={styles.inputError}>
                {formikProps.touched.amount && formikProps.errors.amount}
              </Text>
              <Text style={styles.text}>Remarks</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={formikProps.handleChange("comment")}
              />
              <Text style={styles.inputError}>
                {formikProps.touched.comment && formikProps.errors.comment}
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={formikProps.handleSubmit}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Submit Order
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
  },
  addItemContainer: {
    flex: 0.8,
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  dateTextInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#a8a8a8",
    opacity: 0.5,
  },
  text: {
    paddingVertical: 10,
  },
  addButton: {
    alignItems: "center",
    backgroundColor: "#006400",
    marginVertical: 50,
    paddingVertical: 10,
    borderRadius: 10,
  },
  inactiveAddButton: {
    alignItems: "center",
    backgroundColor: "#006400",
    opacity: 0.5,
    marginVertical: 50,
    paddingVertical: 10,
    borderRadius: 10,
  },
  inputError: {
    color: "red",
    marginHorizontal: 10,
  },
  checkBox: {
    backgroundColor: "white",
    borderColor: "white",
    paddingVertical: 1,
  },
  selectImage: {
    color: "white",
    alignItems: "center",
    backgroundColor: "#00008B",
    marginVertical: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    backgroundColor: "#adadad",
  },
  selectDateButton: {
    alignItems: "center",
    backgroundColor: "#00008B",
    marginVertical: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
});

export default AddOrderScreen;
