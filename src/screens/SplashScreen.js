import React from "react";
import { Image, SafeAreaView, View } from "react-native";

const SplashScreen = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image source={require("../../assets/Logo.png")} />
    </SafeAreaView>
  );
};

export default SplashScreen;
