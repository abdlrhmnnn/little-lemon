import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Onboarding = () => {
  const [firstName, setFirstName] = useState();
  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [email, setEmail] = useState();
  const [isEmailValid, setIsEmailValid] = useState(true);

  const navigation = useNavigation();

  const handleFirstNameChange = (text) => {
    setFirstName(text);
    setIsFirstNameValid(/^[a-zA-Z]+$/.test(text) && text.length > 0);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setIsEmailValid(/^\S+@\S+\.\S+$/.test(text) && text.length > 0);
  };

  const handleSubmit = async () => {
    if (firstName && email) {
      if (isFirstNameValid && isEmailValid && firstName && email) {
        console.log("valid");
        // Save data to AsyncStorage
        try {
          await AsyncStorage.setItem("isOnboardingCompleted", "true");
          await AsyncStorage.setItem("userName", firstName);
          await AsyncStorage.setItem("userEmail", email);
          navigation.navigate("Profile");
        } catch (error) {
          console.error("Error saving data to AsyncStorage:", error);
        }
      }
    } else {
      if (!firstName && !email) {
        setIsFirstNameValid(false);
        setIsEmailValid(false);
      } else if (!firstName) {
        setIsFirstNameValid(false);
      } else {
        setIsEmailValid(false);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#CEDEBD" }}>
      <View style={styles.header}>
        <Image source={require("../../assets/Logo.png")} />
      </View>
      <Text style={styles.text}>Let us get to know you</Text>
      <View style={styles.formContainer}>
        <Text style={styles.inputTitle}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={handleFirstNameChange}
          placeholder="Enter your first name"
        ></TextInput>
        {!isFirstNameValid && (
          <Text style={styles.errors}>First Name is invalid</Text>
        )}
        <Text style={styles.inputTitle}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={handleEmailChange}
          placeholder="Enter your email"
        ></TextInput>
        {!isEmailValid && <Text style={styles.errors}>Email is invalid</Text>}
      </View>
      <View style={{ backgroundColor: "#9EB384", paddingVertical: 30 }}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    backgroundColor: "#FAF1E4",
    paddingVertical: 15,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  form: {},
  input: {
    height: 40,
    borderColor: "black",
    borderWidth: 0.4,
    borderRadius: 10,
    alignItems: "center",
    padding: 5,
  },
  text: {
    alignSelf: "center",
    paddingTop: 20,
  },
  inputTitle: {
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 15,
  },
  button: {
    height: 40,
    width: 90,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginEnd: 20,
    backgroundColor: "#CEDEBD",
  },
  errors: {
    color: "red",
    marginTop: 3,
  },
});
