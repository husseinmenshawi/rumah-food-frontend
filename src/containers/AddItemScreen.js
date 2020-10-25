import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import { Formik } from "formik";
import * as yup from "yup";
import config from "../../config";
import { NetworkContext } from "../../network-context";

function AddItemScreen({ navigation }) {
  const [addItemError, setAddItemError] = React.useState(null);
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);
  const params = React.useContext(NetworkContext);
  const { accessToken, kitchenId } = params;

  React.useEffect(() => {
    if (addItemError) {
      errorAlert();
      setAddItemError(null);
    }
  }, [addItemError]);

  const initialValues = {
    itemName: "",
    itemPrice: "",
    itemDesc: "",
    isEnabled: true,
    kitchenId,
  };

  const validationSchema = yup.object().shape({
    itemName: yup.string().required("Item name is required"),
    itemPrice: yup.number().required("Item price is required"),
    itemDesc: yup.string().required("Item description is required"),
  });

  const handleAddItem = (values, actions) => {
    const { itemName, itemPrice, itemDesc, isEnabled, kitchenId } = values;
    console.log(accessToken);
    fetch(`http://${config.ipAddress}:3000/api/v1.0/kitchen/item`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemName,
        itemPrice,
        itemDesc,
        isEnabled,
        kitchenId,
      }),
    })
      .then((res) => {
        if (res.status === 201) {
          navigation.goBack();
        }
        // else if (res.status === 409) {
        //   throw new Error("Email already exists");
        // }
      })
      .catch((error) => {
        setAddItemError(error.message);
      });
  };

  const errorAlert = () =>
    Alert.alert(
      "Adding Item Error",
      `${addItemError}`,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  return (
    <View style={styles.container}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          handleAddItem(values, actions);
        }}
        validationSchema={validationSchema}
      >
        {(formikProps) => (
          <View style={styles.addItemContainer}>
            <Text style={styles.text}>Item Name</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={formikProps.handleChange("itemName")}
            />
            <Text style={styles.inputError}>
              {formikProps.touched.itemName && formikProps.errors.itemName}
            </Text>
            <Text style={styles.text}>Item Description</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={formikProps.handleChange("itemDesc")}
            />
            <Text style={styles.inputError}>
              {formikProps.touched.itemDesc && formikProps.errors.itemDesc}
            </Text>
            <Text style={styles.text}>Item Price</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={formikProps.handleChange("itemPrice")}
            />
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={(newValue) => setToggleCheckBox(newValue)}
            />
            <Text style={styles.inputError}>
              {formikProps.touched.itemPrice && formikProps.errors.itemPrice}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={formikProps.handleSubmit}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}> Add </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
}
const styles = StyleSheet.create({
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
  text: {
    paddingVertical: 10,
  },
  addButton: {
    alignItems: "center",
    backgroundColor: "#006400",
    marginVertical: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  inputError: {
    color: "red",
    marginHorizontal: 10,
  },
});

export default AddItemScreen;
