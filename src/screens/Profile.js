import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  StyleSheet,
  TextInput,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";
import CheckBox from "./../components/CheckBox";

const Profile = () => {
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "1234567890",
    avatarImage: null,
    notifications: {
      email: false,
      passwordChanges: false,
      specialOffers: false,
      newsletter: false,
    },
  });
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleFirstNameChange = (text) => {
    setUserData({ ...userData, firstName: text });
    setIsFirstNameValid(/^[a-zA-Z]+$/.test(text) && text.length > 0);
  };

  const handleEmailChange = (text) => {
    setUserData({ ...userData, email: text });
    setIsEmailValid(/^\S+@\S+\.\S+$/.test(text) && text.length > 0);
  };

  const pickImage = async () => {
    // Your image picker logic
  };

  const removeImage = async () => {
    setUserData({ ...userData, avatarImage: null });
  };

  const saveChanges = () => {
    // Your save changes logic
  };

  const dicardChanges = () => {
    // Your save changes logic
  };

  const logout = () => {
    // Your logout logic
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
    <View style={styles.container}>
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
              {userData.firstName[0]} {userData.lastName[0]}
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
      <Text style={styles.label}>First Name:</Text>
      <TextInput
        style={styles.input}
        value={userData.firstName}
        onChangeText={handleFirstNameChange}
        placeholder="Enter your first name"
      ></TextInput>

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={userData.email}
        onChangeText={handleEmailChange}
        placeholder="Enter your email"
      ></TextInput>

      <Text style={styles.label}>Phone Number:</Text>
      <TextInputMask
        style={styles.input}
        type={"custom"}
        options={{
          mask: "(999) 999-9999",
        }}
        value={userData.phoneNumber}
        onChangeText={(maskedPhoneNumber) =>
          setUserData({ ...userData, phoneNumber: maskedPhoneNumber })
        }
      />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
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
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  imagePicker: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
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
});

export default Profile;
