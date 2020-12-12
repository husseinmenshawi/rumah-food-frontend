import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Button,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import * as yup from "yup";
import moment from "moment";

import config from "../../config";
import { NetworkContext } from "../../network-context";

function AddCapacityScreen({ navigation }) {
  const [addCapacityError, setAddCapacityError] = React.useState(null);
  const [dbKitchenItems, setDbKitchenItems] = React.useState([]);
  const params = React.useContext(NetworkContext);
  const { accessToken, kitchenId } = params;
  const today = new Date();
  const [date, setDate] = React.useState(today);
  // const [startDate, setStartDate] = React.useState(today);
  // const [endDate, setEndDate] = React.useState(startDate);
  const [selectedItem, setSelectedItem] = React.useState();
  const [showDateCalendar, setShowDateCalendar] = React.useState(
    false
  );
  // const [showStartDateCalendar, setShowStartDateCalendar] = React.useState(
  //   false
  // );
  // const [showEndDateCalendar, setShowEndDateCalendar] = React.useState(false);
  const [showItemDropDown, setShowItemDropDown] = React.useState(false);

  // const calculateLengthOfAvailablity = () => {
  //   const a = moment([
  //     moment(startDate).year(),
  //     moment(startDate).month(),
  //     moment(startDate).date(),
  //   ]);
  //   const b = moment([
  //     moment(endDate).year(),
  //     moment(endDate).month(),
  //     moment(endDate).date(),
  //   ]);
  //   return b.diff(a, "days") + 1;
  // };

  const onDateChange = (event, selectedDate, formikProps) => {
    const currentDate = selectedDate || date;
    setShowDateCalendar(Platform.OS === "ios");
    setDate(currentDate);
    //TODO: Check if this is best practice
    formikProps.setFieldValue(
      "date",
      moment(currentDate).format("YYYY-MM-DD")
    );
  };

  // const onStartDateChange = (event, selectedDate, formikProps) => {
  //   const currentDate = selectedDate || startDate;
  //   setShowStartDateCalendar(Platform.OS === "ios");
  //   setStartDate(currentDate);
  //   //TODO: Check if this is best practice
  //   setEndDate(currentDate);
  //   formikProps.setFieldValue(
  //     "startDateTime",
  //     moment(currentDate).format("YYYY-MM-DD")
  //   );
  // };

  // const onEndDateChange = (event, selectedDate, formikProps) => {
  //   const currentDate = selectedDate || endDate;
  //   setShowEndDateCalendar(Platform.OS === "ios");
  //   setEndDate(currentDate);
  //   formikProps.setFieldValue(
  //     "endDateTime",
  //     moment(currentDate).format("YYYY-MM-DD")
  //   );
  // };

  React.useEffect(() => {
    if (dbKitchenItems.length === 0) {
      fetchDbKitchenItems();
    }
  }, []);

  React.useEffect(() => {
    if (addCapacityError) {
      errorAlert();
      setAddCapacityError(null);
    }
  }, [addCapacityError]);

  const initialValues = {
    date: moment(date).format("YYYY-MM-DD"),
    // startDateTime: moment(startDate).format("YYYY-MM-DD"),
    // endDateTime: moment(endDate).format("YYYY-MM-DD"),
    kitchenId,
    kitchenItemId: selectedItem,
    amount: "1",
  };

  const validationSchema = yup.object().shape({
    date: yup.date().required("Start date is required"),
    // startDateTime: yup.date().required("Start date is required"),
    // endDateTime: yup.date().required("End date is required"),
    kitchenItemId: yup.string().required("Kitchen item is required"),
    amount: yup.number().required("Amount of capacities is required"),
  });

  const handleAddCapacity = (values, actions) => {
    const {
      date,
      // startDateTime,
      // endDateTime,
      kitchenId,
      kitchenItemId,
      amount,
    } = values;

    fetch(`http://${config.ipAddress}:3000/api/v1.0/kitchen/capacity`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date,
        // startDateTime,
        // endDateTime,
        kitchenId,
        kitchenItemId,
        amount,
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
        setAddCapacityError(error.message);
      });
  };

  const errorAlert = () =>
    Alert.alert(
      "Adding Capacity Error",
      `${addCapacityError}`,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );

  const fetchDbKitchenItems = () => {
    // setLoading(true);
    fetch(
      `http://${config.ipAddress}:3000/api/v1.0/kitchen/item/me?kitchenId=${kitchenId}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const defaultObj = {
          itemName: "Non Selected",
          id: -1,
        };
        data.unshift(defaultObj);
        setDbKitchenItems(data);
      })
      .catch((e) => {
        setError("Some server error!");
        throw new Error("Server Error", e);
      });
  };

  const getItemName = (id) => {
    if (dbKitchenItems.length == 0) {
      return;
    } else {
      const item = dbKitchenItems.find((x) => {
        return x.id == id;
      });

      return item ? item.itemName : "Non Selected";
    }
  };

  return (
    <ScrollView style={styles.background}>
      <View style={styles.container}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            handleAddCapacity(values, actions);
          }}
          validationSchema={validationSchema}
        >
          {(formikProps) => (
            <View style={styles.addItemContainer}>
              {/* <Text style={styles.text}>
                 {`Setting availability for : ${calculateLengthOfAvailablity()} Days `}
              </Text> */}
              <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                  style={{
                    flex: 0.7,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text}>
                    {`Date: ${moment(date).format("YYYY-MM-DD")}`}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.3,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={styles.selectDateButton}
                    onPress={() => setShowDateCalendar(true)}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 11,
                        color: "white",
                      }}
                    >
                      Select Date
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {showDateCalendar && (
                <View>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={"date"}
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) =>
                      onDateChange(event, selectedDate, formikProps)
                    }
                    minimumDate={
                      new Date(
                        moment(today).year(),
                        moment(today).month(),
                        moment(today).date()
                      )
                    }
                  />
                  <Button
                    onPress={() => setShowDateCalendar(false)}
                    title="Done"
                  />
                </View>
              )}
                {/* <View
                  style={{
                    flex: 0.7,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text}>
                    {`Start Date: ${moment(startDate).format("YYYY-MM-DD")}`}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.3,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={styles.selectDateButton}
                    onPress={() => setShowStartDateCalendar(true)}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 11,
                        color: "white",
                      }}
                    >
                      Select Date
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {showStartDateCalendar && (
                <View>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={startDate}
                    mode={"date"}
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) =>
                      onStartDateChange(event, selectedDate, formikProps)
                    }
                    minimumDate={
                      new Date(
                        moment(today).year(),
                        moment(today).month(),
                        moment(today).date()
                      )
                    }
                  />
                  <Button
                    onPress={() => setShowStartDateCalendar(false)}
                    title="Done"
                  />
                </View>
              )}
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View
                  style={{
                    flex: 0.7,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text}>{`End Date: ${moment(
                    endDate
                  ).format("YYYY-MM-DD")}`}</Text>
                </View>
                <View
                  style={{
                    flex: 0.3,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={styles.selectDateButton}
                    onPress={() => setShowEndDateCalendar(true)}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 11,
                        color: "white",
                      }}
                    >
                      Select Date
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {showEndDateCalendar && (
                <View>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={endDate}
                    mode={"date"}
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) =>
                      onEndDateChange(event, selectedDate, formikProps)
                    }
                    minimumDate={
                      new Date(
                        moment(startDate).year(),
                        moment(startDate).month(),
                        moment(startDate).date()
                      )
                    }
                  />
                  <Button
                    onPress={() => setShowEndDateCalendar(false)}
                    title="Done"
                  />
                </View>
              )} */}
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View
                  style={{
                    flex: 0.7,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text}>{`Item: ${getItemName(
                    selectedItem
                  )}`}</Text>
                </View>
                <View
                  style={{
                    flex: 0.3,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={styles.selectDateButton}
                    onPress={() => setShowItemDropDown(true)}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 11,
                        color: "white",
                      }}
                    >
                      Select Item
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.inputError}>
                {formikProps.touched.kitchenItemId &&
                  formikProps.errors.kitchenItemId}
              </Text>
              {showItemDropDown && (
                <View>
                  <Picker
                    selectedValue={selectedItem}
                    style={{ height: 200 }}
                    onValueChange={(itemValue, itemIndex) => {
                      setSelectedItem(itemValue);
                      formikProps.setFieldValue("kitchenItemId", itemValue);
                    }}
                  >
                    {dbKitchenItems.length != 0 &&
                      dbKitchenItems.map((x) => {
                        return (
                          <Picker.Item
                            label={`${x.itemName}`}
                            value={`${x.id}`}
                            key={`${x.id}`}
                          />
                        );
                      })}
                  </Picker>
                  <Button
                    onPress={() => setShowItemDropDown(false)}
                    title="Done"
                  />
                </View>
              )}
              <Text style={styles.text}>Amount</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={formikProps.handleChange("amount")}
                keyboardType={"numeric"}
                value={formikProps.values.amount}
              />
              <Text style={styles.inputError}>
                {formikProps.touched.amount && formikProps.errors.amount}
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={formikProps.handleSubmit}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Create
                </Text>
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
  selectDateButton: {
    alignItems: "center",
    backgroundColor: "#00008B",
    marginVertical: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  inputError: {
    color: "red",
  },
  checkBox: {
    backgroundColor: "white",
    borderColor: "white",
    paddingVertical: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default AddCapacityScreen;
