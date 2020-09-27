import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { NetworkContext } from "../../network-context";
import config from "../../config";

function ProfileScreen({ navigation }) {
  const params = React.useContext(NetworkContext);
  const { accessToken, roleId } = params;
  const roleName = roleId == 2 ? "Seller" : "Buyer";
  const [error, setError] = React.useState(null);
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    if (!user) {
      fetchProfileDetails();
    }
  }, []);

  const fetchProfileDetails = () => {
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
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  const handleLogout = () => {
    fetch("http://192.168.0.103:3000/api/v1.0/gatekeeper/me/token", {
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

  const details = (
    <View style={styles.detailsContainer}>
      <Text style={styles.detailsText}>Name: {user ? user.name : ""}</Text>
      {roleId === 2 && (
        <Text style={styles.detailsText}>
          Kitchen Name: {user ? user.Kitchen.name : ""}
        </Text>
      )}
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
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>Profile</Text>
      </View>
      {user ? details : null}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Text
            style={{ color: "white", alignSelf: "center", fontWeight: "bold" }}
          >
            Logout
          </Text>
        </TouchableOpacity>
        <Text style={styles.error}>{error ? error : null}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
    // flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "center",
  },
  headerContainer: {
    // backgroundColor: "red",
    paddingTop: 100,
    paddingHorizontal: 30,
    // flex: 1,
  },
  detailsContainer: {
    paddingTop: 20,
    // backgroundColor: "green",
    paddingHorizontal: 30,
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
});

export default ProfileScreen;
