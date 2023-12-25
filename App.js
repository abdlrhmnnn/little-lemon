import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from "./src/screens/SplashScreen";
import Profile from "./src/screens/Profile";
import Onboarding from "./src/screens/Onboarding";
import Home from "./src/screens/Home";

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
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

  const [isOnboardingComplete, setIsOnboardingComplete] = useState(null);

  useEffect(() => {
    checkUserState();
  }, []);

  const checkUserState = async () => {
    try {
      const userState = await AsyncStorage.getItem("isOnboardingCompleted");
      setIsOnboardingComplete(userState === "true" ? true : false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        {/* {isOnboardingComplete === null ? (
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            {isOnboardingComplete ? (
              <>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Profile" component={Profile} />
              </>
            ) : (
              <Stack.Screen
                name="Onboarding"
                component={Onboarding}
                options={{ headerShown: false }}
              />
            )}
          </>
        )} */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
