import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { CheckBox } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import * as yup from "yup";
import config from "../../config";
import { NetworkContext } from "../../network-context";

function EditItemScreen({ navigation }) {
  const [editItemError, setEditItemError] = React.useState(null);
  const params = React.useContext(NetworkContext);
  const { itemId, accessToken } = params;

  const [itemState, setItemState] = React.useState(null);
  const [updatedImage, setUpdatedImage] = React.useState({});

  React.useEffect(() => {
    if (!itemState) {
      handleFetchItem();
    }
  }, []);

  React.useEffect(() => {
    if (itemState) {
      setUpdatedImage({
        uri: itemState.fileUri,
      });
    }
  }, [itemState]);

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
        setEditItemError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  let initialValues = {
    itemName: "",
    itemPrice: "",
    itemDesc: "",
    isEnabled: "",
    image: null,
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

  if (itemState) {
    const flavourIds = itemState.Flavours.map(
      (x) => x.KitchenItemFlavours.flavourId
    );
    const initialValueFlavours = initialValues.flavours;
    const filtered = initialValueFlavours.map((x) => {
      if (flavourIds.includes(x.id)) {
        x.checked = true;
      }
      return x;
    });
    initialValues = {
      itemName: itemState.itemName,
      itemPrice: String(itemState.itemPrice),
      itemDesc: itemState.itemDesc,
      isEnabled: itemState.isEnabled,
      flavours: filtered,
      image: { uri: itemState.fileUri },
    };
  }

  const validationSchema = yup.object().shape({
    itemName: yup.string().required("Item name is required"),
    itemPrice: yup
      .number("Price must be a number")
      .required("Item price is required"),
    itemDesc: yup.string().required("Item description is required"),
    isEnabled: yup.boolean().required("Item Activity is required"),
    image: yup
      .object()
      .typeError("An image must be selected")
      .required("An image must be selected"),
    flavours: yup.array().required("At least one flavour must be selected"),
  });

  const handleEditItem = (values) => {
    const {
      itemName,
      itemPrice,
      itemDesc,
      isEnabled,
      flavours,
      image,
    } = values;
    console.log("IMAGE: ", image);
    const selectFlavours = flavours.filter((x) => {
      return x.checked == true;
    });
    const selectFlavourIds = selectFlavours.map((x) => x.id);

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
        flavours: selectFlavourIds,
        fileUri: image.uri,
        fileMimeType: image.uri.split(".")[1],
      }),
    })
      .then((res) => {
        if (res.status === 204) {
          navigation.goBack();
        }
        if (res.status === 400) {
          setEditItemError("Please fill up all fields");
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
    <ScrollView style={styles.background}>
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
                  {formikProps.touched.itemPrice &&
                    formikProps.errors.itemPrice}
                </Text>
                <Text style={styles.text}>Item Image</Text>
                {updatedImage && (
                  <Image
                    source={{ uri: updatedImage.uri }}
                    style={{ width: 100, height: 100 }}
                  />
                )}
                <TouchableOpacity
                  style={styles.selectImage}
                  onPress={async () => {
                    if (Platform.OS !== "web") {
                      const {
                        status,
                      } = await ImagePicker.requestCameraRollPermissionsAsync();
                      if (status !== "granted") {
                        alert(
                          "Sorry, we need camera roll permissions to make this work!"
                        );
                      }
                    }
                    let result = await ImagePicker.launchImageLibraryAsync({
                      mediaTypes: ImagePicker.MediaTypeOptions.All,
                      allowsEditing: true,
                      aspect: [4, 3],
                      quality: 1,
                      // base64: true,
                    });

                    if (!result.cancelled) {
                      setUpdatedImage(result);
                      formikProps.values.image = result;
                      formikProps.setFieldValue(
                        "image",
                        formikProps.values.image
                      );
                    }
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 11,
                      color: "white",
                    }}
                  >
                    Change Image
                  </Text>
                </TouchableOpacity>
                <Text style={styles.inputError}>
                  {formikProps.touched.image && formikProps.errors.image}
                </Text>
                <Text style={styles.text}>Item Activity</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  value={formikProps.values.isEnabled}
                  onValueChange={(value) =>
                    formikProps.setFieldValue("isEnabled", value)
                  }
                />
                <Text style={styles.text}>Flavours</Text>
                {initialValues.flavours.length != 0 &&
                  initialValues.flavours.map((x) => {
                    const flavour = formikProps.values.flavours.find(
                      (y) => y.id == x.id
                    );
                    return (
                      <CheckBox
                        key={x.id}
                        title={`${x.name}`}
                        checked={flavour.checked}
                        containerStyle={styles.checkBox}
                        onPress={() => {
                          const index = formikProps.values.flavours.indexOf(
                            flavour
                          );
                          formikProps.values.flavours[
                            index
                          ].checked = !formikProps.values.flavours[index]
                            .checked;
                          formikProps.setFieldValue(
                            "flavours",
                            formikProps.values.flavours
                          );
                        }}
                      />
                    );
                  })}
                <Text style={styles.inputError}>
                  {formikProps.touched.flavours && formikProps.errors.flavours}
                </Text>
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
});

export default EditItemScreen;
