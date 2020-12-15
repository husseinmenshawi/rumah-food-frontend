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
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import config from "../../config";
import { NetworkContext } from "../../network-context";

const windowHeight = Dimensions.get("window").height;

function EditProfileScreen({ navigation }) {
  const [editProfileError, setEditProfileError] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(null);
  const params = React.useContext(NetworkContext);
  const { accessToken } = params;

  React.useEffect(() => {
    if (!user) {
      handleFetchUser();
    }
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      handleFetchUser();
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    if (editProfileError) {
      errorAlert();
      setEditProfileError(null);
    }
  }, [editProfileError]);

  const handleFetchUser = () => {
    setLoading(true);
    fetch(`http://${config.ipAddress}:3000/api/v1.0/gatekeeper/me`, {
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
        setUser(data);
        setLoading(false);
      })
      .catch((e) => {
        setEditProfileError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  let initialValues = {
    name: "",
    email: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
  };

  if (user) {
    initialValues = {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      addressLine1: user.addressLine1,
      addressLine2: user.addressLine2,
      addressLine3: user.addressLine3,
    };
  }

  const validationSchema = yup.object().shape({
    name: yup.string().required("name is required"),
    email: yup
      .string("Email must be valid")
      .required("email is required")
      .email(),
    phoneNumber: yup.string().required("Item description is required"),
    addressLine1: yup.string().required("Address Line 1 is required"),
    addressLine2: yup.string().required("Address Line 2 is required"),
    addressLine3: yup.string().notRequired(),
  });

  const handleEditUser = (values) => {
    const {
      name,
      email,
      phoneNumber,
      addressLine1,
      addressLine2,
      addressLine3,
    } = values;

    fetch(`http://${config.ipAddress}:3000/api/v1.0/user/me`, {
      method: "patch",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phoneNumber,
        addressLine1,
        addressLine2,
        addressLine3,
      }),
    })
      .then((res) => {
        if (res.status === 204) {
          navigation.goBack();
        } else if (res.status === 409) {
          throw new Error("Email already exists");
        }
      })
      .catch((error) => {
        setEditProfileError(error.message);
      });
  };

  const errorAlert = () =>
    Alert.alert(
      "Editing User Error",
      `${editProfileError}`,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: true }
    );
  const loadingIndicator = (
    <View style={styles.loadingView}>
      <ActivityIndicator size="large" />
    </View>
  );
  return (
    // <KeyboardAvoidingView style={styles.background}>
    <ScrollView style={styles.background}>
      <View style={styles.container}>
        {loading ? (
          loadingIndicator
        ) : (
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              handleEditUser(values);
            }}
            validationSchema={validationSchema}
          >
            {(formikProps) => (
              <View style={styles.editProfileContainer}>
                <Text style={styles.text}>Name</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={formikProps.handleChange("name")}
                  value={formikProps.values.name}
                />
                <Text style={styles.inputError}>
                  {formikProps.touched.name && formikProps.errors.name}
                </Text>
                <Text style={styles.text}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={formikProps.handleChange("email")}
                  value={formikProps.values.email}
                />
                <Text style={styles.inputError}>
                  {formikProps.touched.email && formikProps.errors.email}
                </Text>
                <Text style={styles.text}>Phone Number</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={formikProps.handleChange("phoneNumber")}
                  value={formikProps.values.phoneNumber}
                />
                <Text style={styles.inputError}>
                  {formikProps.touched.phoneNumber &&
                    formikProps.errors.phoneNumber}
                </Text>
                <Text style={styles.text}>Address Line 1</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={formikProps.handleChange("addressLine1")}
                  value={formikProps.values.addressLine1}
                />
                <Text style={styles.inputError}>
                  {formikProps.touched.addressLine1 &&
                    formikProps.errors.addressLine1}
                </Text>
                <Text style={styles.text}>Address Line 2</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={formikProps.handleChange("addressLine2")}
                  value={formikProps.values.addressLine2}
                />
                <KeyboardAvoidingView behavior="height">
                  <Text style={styles.inputError}>
                    {formikProps.touched.addressLine2 &&
                      formikProps.errors.addressLine2}
                  </Text>
                  <Text style={styles.text}>Address Line 3</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={formikProps.handleChange("addressLine3")}
                    value={formikProps.values.addressLine3}
                  />
                  <Text style={styles.inputError}>
                    {formikProps.touched.addressLine3 &&
                      formikProps.errors.addressLine3}
                  </Text>
                </KeyboardAvoidingView>
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
    justifyContent: "center",
  },
  editProfileContainer: {
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
  loadingView: {
    marginVertical: windowHeight / 3,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});

export default EditProfileScreen;
