import React, { useEffect, useState } from "react";
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
import { colors, Typoghraphy, filterButtons } from "../helper";

const Onboarding = ({ route }) => {
  const { isOnboardingComplete } = route.params;
  const [firstName, setFirstName] = useState();
  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [email, setEmail] = useState();
  const [isEmailValid, setIsEmailValid] = useState(true);

  const navigation = useNavigation();

  const handleFirstNameChange = (text) => {
    setFirstName(text);
    setIsFirstNameValid(/^[a-zA-Z]+$/.test(text) && text.length > 0);
  };

  useEffect(() => {
    if (isOnboardingComplete && isOnboardingComplete === true) {
      navigation.replace("Home");
    }
  }, []);

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
          await AsyncStorage.setItem("firstName", firstName);
          await AsyncStorage.setItem("email", email);
          await AsyncStorage.setItem("lastName", "");
          await AsyncStorage.setItem("phoneNumber", "");
          await AsyncStorage.setItem("avatarImage", "");
          navigation.navigate("Home");
          // setFirstName(undefined);
          // setEmail(undefined);
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
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
      <View style={styles.header}>
        <Image source={require("../../assets/Logo.png")} />
      </View>
      <View style={styles.heroContainer}>
        <Text style={styles.headLine}>Little lemon</Text>
        <View style={styles.decandImageContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.subTitle}>Chicago</Text>
            <Text style={[styles.decription, { marginRight: 30 }]}>
              We are a family owned Mediterranean restaurant, focused on
              traditional recipes served with a modern twist.
            </Text>
          </View>
          <Image
            source={require("../../assets/HeroImage.png")}
            style={styles.heroImage}
          />
        </View>
      </View>
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={styles.inputTitle}>Name *</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={handleFirstNameChange}
          placeholder="Enter your first name"
        ></TextInput>
        {!isFirstNameValid && (
          <Text style={styles.errors}>First Name is invalid</Text>
        )}
        <Text style={[styles.inputTitle, { marginTop: 20 }]}>Email *</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={handleEmailChange}
          placeholder="Enter your email"
        ></TextInput>
        {!isEmailValid && <Text style={styles.errors}>Email is invalid</Text>}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={[styles.decription, { color: colors.highlightWhite }]}>
          Next
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: colors.primaryGreen,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.highlightWhite,
  },
  heroContainer: {
    backgroundColor: colors.primaryGreen,
    padding: 16,
  },
  headLine: {
    ...Typoghraphy.displayTitle,
    color: colors.primaryYellow,
  },
  subTitle: {
    ...Typoghraphy.subtitle,
    color: colors.highlightWhite,
    marginBottom: 10,
  },
  decandImageContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  decription: {
    ...Typoghraphy.leadText,
    color: colors.highlightWhite,
  },
  heroImage: {
    width: 120,
    height: 140,
    borderRadius: 10,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  form: {},
  input: {
    height: 40,
    borderColor: "grey",
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
    ...Typoghraphy.leadText,
    color: "grey",
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    height: 40,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginEnd: 20,
    backgroundColor: colors.primaryGreen,
    marginBottom: 30,
  },
  errors: {
    color: "red",
    marginTop: 3,
    fontSize: 12,
  },
});
