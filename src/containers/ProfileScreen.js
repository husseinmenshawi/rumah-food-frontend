import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { NetworkContext } from "../../network-context";
import config from "../../config";

import Ionicons from "@expo/vector-icons/Ionicons";

function ProfileScreen({ navigation }) {
  const params = React.useContext(NetworkContext);
  const { accessToken, roleId } = params;
  const roleName = roleId == 2 ? "Seller" : "Buyer";
  const [error, setError] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (!user) {
      fetchProfileDetails();
    }
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchProfileDetails();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchProfileDetails = () => {
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
        setLoading(false);
        setUser(data);
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  const handleLogout = () => {
    fetch(`http://${config.ipAddress}:3000/api/v1.0/gatekeeper/me/token`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 204) {
          navigation.navigate("Start");
        }
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile", {
      accessToken,
    });
  };

  const profileDetails = (
    <View style={styles.detailsContainer}>
      <Text style={styles.detailsText}>Name: {user ? user.name : ""}</Text>
      <Text style={styles.detailsText}>Email: {user ? user.email : ""}</Text>
      <Text style={styles.detailsText}>
        Phone Number: {user ? user.phoneNumber : ""}
      </Text>
      <Text style={styles.detailsText}>
        Address Line 1: {user ? user.addressLine1 : ""}
      </Text>
      <Text style={styles.detailsText}>
        Address Line 2: {user ? user.addressLine2 : ""}
      </Text>
      <Text style={styles.detailsText}>
        Address Line 3: {user ? user.addressLine3 : ""}
      </Text>
      <Text style={styles.detailsText}>Role: {roleName}</Text>
      <TouchableOpacity
        style={{ alignSelf: "flex-end" }}
        onPress={handleEditProfile}
      >
        <Ionicons
          style={{ color: "black" }}
          name="md-create"
          size={30}
          color="black"
        />
      </TouchableOpacity>
    </View>
  );

  const kitchenDetails = (
    <View style={styles.detailsContainer}>
      <Text style={styles.detailsText}>
        Kitchen Name: {user ? user.Kitchen.name : ""}
      </Text>
      <Text style={styles.detailsText}>
        Email: {user ? user.Kitchen.email : ""}
      </Text>
      <Text style={styles.detailsText}>
        Phone Number: {user ? user.Kitchen.phoneNumber : ""}
      </Text>
      <Text style={styles.detailsText}>
        Address Line 1: {user ? user.Kitchen.addressLine1 : ""}
      </Text>
      <Text style={styles.detailsText}>
        Address Line 2: {user ? user.Kitchen.addressLine2 : ""}
      </Text>
      <Text style={styles.detailsText}>
        Address Line 3: {user ? user.Kitchen.addressLine3 : ""}
      </Text>
      <TouchableOpacity style={{ alignSelf: "flex-end" }}>
        <Ionicons
          style={{ color: "black" }}
          name="md-create"
          size={30}
          color="black"
        />
      </TouchableOpacity>
    </View>
  );

  const loadingIndicator = (
    <View style={styles.loadingView}>
      <ActivityIndicator size="large" />
    </View>
  );

  return (
    <ScrollView style={styles.background}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>Profile</Text>
        </View>
        {loading ? loadingIndicator : profileDetails}
        {roleId === 2 && (
          <View style={styles.headerContainer}>
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>Kitchen</Text>
          </View>
        )}
        {loading && roleId === 2
          ? loadingIndicator
          : !loading && roleId == 2
          ? kitchenDetails
          : null}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.logout} onPress={handleLogout}>
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                fontWeight: "bold",
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
          <Text style={styles.error}>{error ? error : null}</Text>
        </View>
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
  },
  headerContainer: {
    paddingTop: 50,
    paddingHorizontal: 30,
  },
  detailsContainer: {
    backgroundColor: "white",
    padding: 10,
    marginHorizontal: 30,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  detailsText: {
    paddingVertical: 5,
    fontSize: 15,
  },
  buttonContainer: {
    // backgroundColor: "blue",
    justifyContent: "flex-end",
    paddingHorizontal: 30,
    flex: 1,
  },
  logout: {
    alignItems: "center",
    backgroundColor: "#b4151c",
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  error: {
    color: "red",
  },
  loadingView: {
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;
