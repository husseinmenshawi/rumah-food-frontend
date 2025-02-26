import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";

import { Formik } from "formik";
import * as yup from "yup";
import config from "../../config";

export default function SellerRegisterScreen({ navigation }) {
  const [registerError, setRegisterError] = React.useState(null);
  React.useEffect(() => {
    if (registerError) {
      errorAlert();
      setRegisterError(null);
    }
  }, [registerError]);
  const initialValues = {
    name: "",
    email: "",
    password: "",
    kitchenName: "",
    phoneNumber: "",
  };
  const phoneRegex = /^(\+?6?01)[0|1|2|3|4|6|7|8|9]\-*[0-9]{7,8}$/;

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required").email(),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Min length is 8 characters"),
    kitchenName: yup.string().required("Kitchen Name is required"),
    phoneNumber: yup
      .string()
      .matches(phoneRegex, "Phone number is not valid.")
      .required("Mobile Number is required")
      .trim(),
  });

  const navigateSellerLoginScreen = () => {
    navigation.navigate("SellerLogin");
  };
  const navigateLandingScreen = () => {
    navigation.navigate("Start");
  };

  const handleRegister = (values) => {
    const { name, email, password, phoneNumber, kitchenName } = values;
    const roleId = 2;
    fetch(`http://${config.ipAddress}:3000/api/v1.0/user`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phoneNumber,
        kitchenName,
        roleId,
      }),
    })
      .then((res) => {
        if (res.status === 201) {
          navigation.navigate("SellerLogin");
        } else if (res.status === 409) {
          throw new Error("Email already exists");
        }
      })
      .catch((error) => {
        setRegisterError(error.message);
        // errorAlert();
      });
  };

  const errorAlert = () =>
    Alert.alert(
      "Register Error",
      `${registerError}`,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle={"dark-content"} />
      <View style={styles.titleContainer}>
        <Text style={styles.title}> Seller</Text>
      </View>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          handleRegister(values);
        }}
        validationSchema={validationSchema}
      >
        {(formikProps) => (
          <View style={styles.registerContainer}>
            <Text style={styles.text}>Name</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={formikProps.handleChange("name")}
            />
            <Text style={styles.inputError}>
              {formikProps.touched.name && formikProps.errors.name}
            </Text>
            <Text style={styles.text}>Email</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={formikProps.handleChange("email")}
            />
            <Text style={styles.inputError}>
              {formikProps.touched.email && formikProps.errors.email}
            </Text>
            <Text style={styles.text}>Password</Text>
            <TextInput
              secureTextEntry
              style={styles.textInput}
              onChangeText={formikProps.handleChange("password")}
            />
            <Text style={styles.inputError}>
              {formikProps.touched.password && formikProps.errors.password}
            </Text>
            <Text style={styles.text}>Kitchen Name</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={formikProps.handleChange("kitchenName")}
            />
            <Text style={styles.inputError}>
              {formikProps.touched.kitchenName &&
                formikProps.errors.kitchenName}
            </Text>
            <Text style={styles.text}>Phone No.</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={formikProps.handleChange("phoneNumber")}
            />
            <Text style={styles.inputError}>
              {formikProps.touched.phoneNumber &&
                formikProps.errors.phoneNumber}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={formikProps.handleSubmit}
            >
              <Text style={{ color: "black" }}> Register </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateSellerLoginScreen}>
              <Text style={styles.loginText}>
                Already have an account? Click here to login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateLandingScreen}>
              <Text style={styles.loginText2}>Not a Seller? Click here</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 50,
  },
  titleContainer: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  registerContainer: {
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
  button: {
    alignItems: "center",
    backgroundColor: "#CCCC00",
    marginVertical: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  loginText: {
    marginBottom: 20,
    alignSelf: "center",
  },
  loginText2: {
    marginBottom: 50,
    alignSelf: "center",
  },
  inputError: {
    color: "red",
    marginHorizontal: 10,
  },
});
