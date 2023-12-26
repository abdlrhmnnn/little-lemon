import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";
import CheckBox from "./../components/CheckBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { colors, Typoghraphy, filterButtons } from "../helper";
import * as ImagePicker from "expo-image-picker";

const Profile = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    avatarImage: "",
    notifications: {
      email: false,
      passwordChanges: false,
      specialOffers: false,
      newsletter: false,
    },
  });
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    // console.log("firstName:");
    getStoredData();
  }, []);

  const getStoredData = async () => {
    try {
      const firstName = await AsyncStorage.getItem("firstName");
      const lastName = await AsyncStorage.getItem("lastName");
      const email = await AsyncStorage.getItem("email");
      const phoneNumber = await AsyncStorage.getItem("phoneNumber");
      const avatarImage = await AsyncStorage.getItem("avatarImage");
      const notificationsString = await AsyncStorage.getItem("notifications");
      const notifications = notificationsString
        ? JSON.parse(notificationsString)
        : {};

      setUserData({
        firstName,
        lastName,
        email,
        phoneNumber,
        avatarImage,
        notifications,
      });

      console.log("Retrieved Data:", {
        firstName,
        lastName,
        email,
        phoneNumber,
        avatarImage,
        notifications,
      });
    } catch (error) {
      console.error("Error getting data from AsyncStorage:", error);
    }
  };

  const handleFirstNameChange = (text) => {
    setUserData({ ...userData, firstName: text });
    setIsFirstNameValid(/^[a-zA-Z]+$/.test(text) && text.length > 0);
  };

  const handleLastNameChange = (text) => {
    setUserData({ ...userData, lastName: text });
    setIsLastNameValid(/^[a-zA-Z]+$/.test(text) && text.length > 0);
  };

  const handleEmailChange = (text) => {
    setUserData({ ...userData, email: text });
    setIsEmailValid(/^\S+@\S+\.\S+$/.test(text) && text.length > 0);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setUserData({ ...userData, avatarImage: result.assets[0].uri });
    }
  };

  const removeImage = async () => {
    setUserData({ ...userData, avatarImage: null });
  };

  const saveChanges = async () => {
    if (userData.firstName && userData.email) {
      if (isFirstNameValid && isEmailValid) {
        try {
          // Save each property individually
          await AsyncStorage.setItem("firstName", userData.firstName);
          if (userData.lastName?.length) {
            await AsyncStorage.setItem("lastName", userData.lastName);
          }
          await AsyncStorage.setItem("email", userData.email);
          if (userData.phoneNumber?.length) {
            await AsyncStorage.setItem("phoneNumber", userData.phoneNumber);
          }
          if (userData.avatarImage?.length) {
            await AsyncStorage.setItem("avatarImage", userData.avatarImage);
          }
          await AsyncStorage.setItem(
            "notifications",
            JSON.stringify(userData.notifications)
          );

          // Navigate to Home screen
          navigation.replace("Home");
        } catch (error) {
          console.error("Error saving data to AsyncStorage:", error);
        }
      }
    } else {
      if (!userData.firstName && !userData.email) {
        setIsFirstNameValid(false);
        setIsEmailValid(false);
      } else if (!userData.firstName) {
        setIsFirstNameValid(false);
      } else {
        setIsEmailValid(false);
      }
    }
  };

  const dicardChanges = () => {
    navigation.navigate("Home");
  };

  const logout = async () => {
    try {
      await AsyncStorage.clear();

      navigation.replace("Onboarding");
    } catch (error) {
      console.error("Error saving data to AsyncStorage:", error);
    }
  };

  const toggleOption = (option) => {
    setUserData((prevUserData) => {
      const updatedNotifications = {
        ...prevUserData.notifications,
        [option]: !prevUserData.notifications[option],
      };

      return {
        ...prevUserData,
        notifications: updatedNotifications,
      };
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonIconContainer}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.backButtonIcon}>{"<--"}</Text>
        </TouchableOpacity>
        <Image source={require("../../assets/Logo.png")} />
        {userData.avatarImage ? (
          <Image
            source={{ uri: userData.avatarImage }}
            style={styles.navigationAvatarLogo}
          />
        ) : (
          <View style={styles.navigationAvatarPlaceholder}>
            <Text style={styles.navigationAvatarInitials}>
              {userData?.firstName ? userData.firstName[0] : ""}
              {userData?.lastName ? userData.lastName[0] : ""}
            </Text>
          </View>
        )}
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.headLine}>Personal information</Text>
        <View style={styles.imagePicker}>
          {userData.avatarImage ? (
            <Image
              source={{ uri: userData.avatarImage }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>
                {userData?.firstName ? userData.firstName[0] : ""}
                {userData?.lastName ? userData.lastName[0] : ""}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
            <Text style={styles.changeTextButton}>Change</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
            <Text style={styles.removeTextButton}>Remove</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={userData?.firstName}
          onChangeText={handleFirstNameChange}
          placeholder="Enter your first name"
        ></TextInput>
        {!isFirstNameValid && (
          <Text style={styles.errors}>First Name is invalid</Text>
        )}
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={userData?.lastName}
          onChangeText={handleLastNameChange}
          placeholder="Enter your last name"
        ></TextInput>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={userData?.email}
          onChangeText={handleEmailChange}
          placeholder="Enter your email"
        ></TextInput>
        {!isEmailValid && <Text style={styles.errors}>Email is invalid</Text>}

        <Text style={styles.label}>Phone Number</Text>
        <TextInputMask
          style={styles.input}
          type={"custom"}
          options={{
            mask: "(999) 999-9999",
          }}
          placeholder="Enter your phone number "
          value={userData?.phoneNumber}
          onChangeText={(maskedPhoneNumber) =>
            setUserData({ ...userData, phoneNumber: maskedPhoneNumber })
          }
        />
        <Text style={[styles.headLine, { marginBottom: -5, marginTop: 20 }]}>
          Email Notifications
        </Text>
        <CheckBox
          options={[
            "Email Notifications",
            "Password Changes",
            "Special Offers",
            "Newsletter",
          ]}
          selectedOptions={Object.keys(userData.notifications).filter(
            (key) => userData.notifications[key]
          )}
          onToggleOption={toggleOption}
        />

        <TouchableOpacity
          onPress={logout}
          style={[styles.button, { backgroundColor: "#F4CE14" }]}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity style={styles.removeButton} onPress={dicardChanges}>
            <Text style={styles.removeTextButton}>Discard Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.changes} onPress={saveChanges}>
            <Text style={styles.changeTextButton}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    borderWidth: 0.2,
    borderColor: "grey",
    margin: 10,
    padding: 20,
    borderRadius: 10,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  navigationAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  navigationAvatarLogo: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  navigationAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: colors.primaryGreen,
    justifyContent: "center",
    alignItems: "center",
  },
  navigationAvatarInitials: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.highlightWhite,
  },
  navigationLabel: {
    fontSize: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  headLine: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 0.4,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  imagePicker: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "#EE9972",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: "bold",
  },
  checkboxContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: "#495E57",
    textAlign: "center",
    fontSize: 16,
  },
  changeButton: {
    backgroundColor: "#495E57",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    marginHorizontal: 20,
  },
  changeTextButton: {
    color: "#EDEFEE",
  },
  removeButton: {
    backgroundColor: "#EDEFEE",
    padding: 10,
    borderRadius: 5,
    borderColor: "#495E57",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  removeTextButton: {
    color: "#495E57",
  },
  changes: {
    backgroundColor: "#495E57",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    marginStart: 30,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginEnd: 10,
  },
  checkmark: {
    color: "white",
    fontSize: 16,
  },
  label: {
    ...Typoghraphy.leadText,
    fontSize: 12,
    fontWeight: "400",
    color: "grey",
    marginBottom: 5,
    marginTop: 10,
  },
  backButtonIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: colors.primaryGreen,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonIcon: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.highlightWhite,
    letterSpacing: -4,
  },
  errors: {
    color: "red",
    marginBottom: 5,
    fontSize: 12,
  },
});

export default Profile;
