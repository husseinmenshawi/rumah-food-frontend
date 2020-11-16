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
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CheckBox } from "react-native-elements";
import { Formik } from "formik";
import * as yup from "yup";
import config from "../../config";
import { NetworkContext } from "../../network-context";

function AddItemScreen({ navigation }) {
  const [addItemError, setAddItemError] = React.useState(null);
  const [dbFlavours, setDbFlavours] = React.useState([]);
  const [image, setImage] = React.useState(null);
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
    image: null,
    //TODO: find a better way to implement a checkbox in this form.
    flavours: [],
    unSelectedFlavours: [
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
    image: yup
      .object()
      .typeError("An image must be selected")
      .required("An image must be selected"),
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
      image,
    } = values;
    // const data = new FormData();
    const selectFlavours = flavours.filter((x) => {
      return x.checked == true;
    });
    const selectFlavourIds = selectFlavours.map((x) => x.id);
    // data.append("fileBuffer", image.base64);
    // data.append("fileUri", image.uri);
    // data.append("fileMimeType", image.image.uri.split(".")[1]);

    fetch(`http://${config.ipAddress}:3000/api/v1.0/kitchen/item`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      //TODO: in order to store the image buffer, I need to call another API that use a formData as a body (Include buffer in the formdata)
      // body: data,
      body: JSON.stringify({
        itemName,
        itemPrice,
        itemDesc,
        isEnabled,
        kitchenId,
        flavours: selectFlavourIds,
        fileUri: image.uri,
        fileMimeType: image.uri.split(".")[1],
      }),
    })
      .then((res) => {
        if (res.status === 201) {
          navigation.goBack();
        }
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
              <Text style={styles.text}>Item Image</Text>
              {image && (
                <Image
                  source={{ uri: image.uri }}
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
                    setImage(result);
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
                  Open Gallery
                </Text>
              </TouchableOpacity>
              <Text style={styles.inputError}>
                {formikProps.touched.image && formikProps.errors.image}
              </Text>
              <Text style={styles.text}>Flavours</Text>
              {dbFlavours.length != 0 &&
                dbFlavours.map((x) => {
                  const flavour = formikProps.values.unSelectedFlavours.find(
                    (y) => y.id == x.id
                  );
                  return (
                    <CheckBox
                      key={x.id}
                      title={`${x.flavourName}`}
                      checked={flavour.checked}
                      containerStyle={styles.checkBox}
                      onPress={() => {
                        const index = formikProps.values.unSelectedFlavours.indexOf(
                          flavour
                        );
                        formikProps.values.unSelectedFlavours[
                          index
                        ].checked = !formikProps.values.unSelectedFlavours[
                          index
                        ].checked;
                        formikProps.values.flavours =
                          formikProps.values.unSelectedFlavours;
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

export default AddItemScreen;
