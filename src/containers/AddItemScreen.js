import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { Formik } from "formik";
import * as yup from "yup";
import config from "../../config";
import { NetworkContext } from "../../network-context";

function AddItemScreen({ navigation }) {
  const [addItemError, setAddItemError] = React.useState(null);
  const [dbFlavours, setDbFlavours] = React.useState([]);
  const params = React.useContext(NetworkContext);
  const { accessToken, kitchenId } = params;

  React.useEffect(() => {
    if (dbFlavours.length === 0) {
      fetchDbFlavours();
    }
  }, []);

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
    //TODO: find a better way to implement a checkbox in this form.
    flavours: [
      {
        id: 1,
        name: "Vanilla",
        checked: false,
      },
      {
        id: 2,
        name: "Chocholate",
        checked: false,
      },
      {
        id: 3,
        name: "Butter",
        checked: false,
      },
      {
        id: 4,
        name: "Strawberry",
        checked: false,
      },
      {
        id: 5,
        name: "Green Tea",
        checked: false,
      },
    ],
  };

  const validationSchema = yup.object().shape({
    itemName: yup.string().required("Item name is required"),
    itemPrice: yup.number().required("Item price is required"),
    itemDesc: yup.string().required("Item description is required"),
    flavours: yup.array().required("At least one flavour must be selected"),
  });

  const handleAddItem = (values, actions) => {
    const {
      itemName,
      itemPrice,
      itemDesc,
      isEnabled,
      kitchenId,
      flavours,
    } = values;

    const selectFlavours = flavours.filter((x) => {
      return x.checked == true;
    });
    const selectFlavourIds = selectFlavours.map((x) => x.id);
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
        flavours: selectFlavourIds,
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

  const fetchDbFlavours = () => {
    // setLoading(true);
    fetch(`http://${config.ipAddress}:3000/api/v1.0/kitchen/flavours`, {
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
        // setLoading(false);
        setDbFlavours(data);
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  return (
    <ScrollView style={styles.background}>
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
              <Text style={styles.inputError}>
                {formikProps.touched.itemPrice && formikProps.errors.itemPrice}
              </Text>
              <Text style={styles.text}>Flavours</Text>
              {dbFlavours.length != 0 &&
                dbFlavours.map((x) => {
                  const flavour = formikProps.values.flavours.find(
                    (y) => y.id == x.id
                  );
                  return (
                    <CheckBox
                      key={x.id}
                      title={`${x.flavourName}`}
                      checked={flavour.checked}
                      containerStyle={styles.checkBox}
                      onPress={() => {
                        const index = formikProps.values.flavours.indexOf(
                          flavour
                        );
                        formikProps.values.flavours[
                          index
                        ].checked = !formikProps.values.flavours[index].checked;
                        formikProps.setFieldValue(
                          "flavours",
                          formikProps.values.flavours
                        );
                      }}
                    />
                  );
                })}
              <TouchableOpacity
                style={styles.addButton}
                onPress={formikProps.handleSubmit}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Add</Text>
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
  checkBox: {
    backgroundColor: "white",
    borderColor: "white",
    paddingVertical: 1,
  },
});

export default AddItemScreen;
