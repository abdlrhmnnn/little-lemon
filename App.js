import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from "./src/screens/SplashScreen";
import Profile from "./src/screens/Profile";
import Onboarding from "./src/screens/Onboarding";
import Home from "./src/screens/Home";

const Stack = createNativeStackNavigator();

function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(null);

  useEffect(() => {
    checkUserState();
  }, []);

  useEffect(() => {
    console.log("isOnboardingComplete", isOnboardingComplete);
  }, [isOnboardingComplete]);

  const checkUserState = async () => {
    try {
      const userState = await AsyncStorage.getItem("isOnboardingCompleted");
      console.log("userState", userState);
      setIsOnboardingComplete(userState === "true" ? true : false);
    } catch (error) {
      console.error(error);
    }
  };

  if (isOnboardingComplete === null) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{ headerShown: false }}
          initialParams={{ isOnboardingComplete: isOnboardingComplete }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
