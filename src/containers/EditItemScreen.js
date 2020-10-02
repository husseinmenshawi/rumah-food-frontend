import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import config from "../../config";
import { NetworkContext } from "../../network-context";

function EditItemScreen({ navigation }) {
  const [editItemError, setEditItemError] = React.useState(null);
  const params = React.useContext(NetworkContext);
  const { itemId, accessToken } = params;

  const [itemState, setItemState] = React.useState(null);

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
    if (editItemError) {
      errorAlert();
      setEditItemError(null);
    }
  }, [editItemError]);

  const handleFetchItem = () => {
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
        setItemState(data);
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  let initialValues = {
    itemName: "",
    itemPrice: "",
    itemDesc: "",
    isEnabled: "",
  };

  if (itemState) {
    initialValues = {
      itemName: itemState.itemName,
      itemPrice: String(itemState.itemPrice),
      itemDesc: itemState.itemDesc,
      isEnabled: itemState.isEnabled,
    };
  }

  const validationSchema = yup.object().shape({
    itemName: yup.string().required("Item name is required"),
    itemPrice: yup
      .number("Price must be a number")
      .required("Item price is required"),
    itemDesc: yup.string().required("Item description is required"),
    isEnabled: yup.boolean().required("Item Activity is required"),
  });

  const handleEditItem = (values) => {
    const { itemName, itemPrice, itemDesc, isEnabled } = values;
    fetch(`http://${config.ipAddress}:3000/api/v1.0/kitchen/item/${itemId}`, {
      method: "patch",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemName,
        itemPrice,
        itemDesc,
        isEnabled,
      }),
    })
      .then((res) => {
        if (res.status === 204) {
          navigation.goBack();
        }
      })
      .catch((error) => {
        setEditItemError(error.message);
      });
  };

  const errorAlert = () =>
    Alert.alert(
      "Editing Item Error",
      `${editItemError}`,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: true }
    );
  return (
    <View style={styles.container}>
      {itemState && (
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            handleEditItem(values);
          }}
          validationSchema={validationSchema}
        >
          {(formikProps) => (
            <View style={styles.editItemContainer}>
              <Text style={styles.text}>Item Name</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={formikProps.handleChange("itemName")}
                value={formikProps.values.itemName}
              />
              <Text style={styles.inputError}>
                {formikProps.touched.itemName && formikProps.errors.itemName}
              </Text>
              <Text style={styles.text}>Item Description</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={formikProps.handleChange("itemDesc")}
                value={formikProps.values.itemDesc}
              />
              <Text style={styles.inputError}>
                {formikProps.touched.itemDesc && formikProps.errors.itemDesc}
              </Text>
              <Text style={styles.text}>Item Price</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={formikProps.handleChange("itemPrice")}
                value={formikProps.values.itemPrice}
              />
              <Text style={styles.inputError}>
                {formikProps.touched.itemPrice && formikProps.errors.itemPrice}
              </Text>
              <Text style={styles.text}>Item Activity</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                value={formikProps.values.isEnabled}
                onValueChange={(value) =>
                  formikProps.setFieldValue("isEnabled", value)
                }
              />
              <TouchableOpacity
                style={styles.editButton}
                onPress={formikProps.handleSubmit}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
  },
  editItemContainer: {
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
  editButton: {
    alignItems: "center",
    backgroundColor: "#00008B",
    marginVertical: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  inputError: {
    color: "red",
    marginHorizontal: 10,
  },
});

export default EditItemScreen;
