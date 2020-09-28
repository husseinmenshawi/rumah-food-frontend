import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import { Formik } from "formik";
import * as yup from "yup";
import config from "../../config";

export default function SellerLoginScreen({ route, navigation }) {
  const [loginError, setLoginError] = React.useState(null);

  React.useEffect(() => {
    if (loginError) {
      errorAlert();
      setLoginError(null);
    }
  }, [loginError]);
  const validationSchema = yup.object().shape({
    email: yup.string().required("Email is required").email().label("Email"),
    password: yup.string().required("Password is required"),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const navigateSellerRegisterScreen = () => {
    navigation.navigate("SellerRegister");
  };

  const navigateLandingScreen = () => {
    navigation.navigate("Start");
  };

  const handleLogin = (values) => {
    const { email, password } = values;
    const roleId = 2;
    fetch(`http://${config.ipAddress}:3000/api/v1.0/gatekeeper/me/token`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        roleId,
      }),
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Login credentials invalid");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        navigation.navigate("App", {
          accessToken: data.accessToken,
          kitchenId: data.kitchenId,
          roleId: 2,
        });
      })
      .catch((error) => {
        setLoginError(error.message);
        // errorAlert();
      });
  };

  const errorAlert = () =>
    Alert.alert(
      "Login Error",
      `${loginError}`,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}> Seller</Text>
      </View>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleLogin(values);
        }}
      >
        {(formikProps) => (
          <View style={styles.loginContainer}>
            <Text style={styles.text}>Email</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={formikProps.handleChange("email")}
              onBlur={formikProps.handleBlur("email")}
            />
            <Text style={styles.inputError}>
              {formikProps.touched.email && formikProps.errors.email}
            </Text>
            <Text style={styles.text}>Password</Text>
            <TextInput
              secureTextEntry
              style={styles.textInput}
              onChangeText={formikProps.handleChange("password")}
              onBlur={formikProps.handleBlur("password")}
            />
            <Text style={styles.inputError}>
              {formikProps.touched.password && formikProps.errors.password}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={formikProps.handleSubmit}
            >
              <Text style={{ color: "black" }}> Login </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateSellerRegisterScreen}>
              <Text style={styles.registerText}>
                Don't have an account? Click here to register
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateLandingScreen}>
              <Text style={styles.registerText}>Not a Seller? Click here</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    marginTop: 100,
    fontWeight: "bold",
    fontSize: 20,
  },
  loginContainer: {
    flex: 1,
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
  registerText: {
    marginBottom: 10,
    alignSelf: "center",
  },
  inputError: {
    color: "red",
  },
});
