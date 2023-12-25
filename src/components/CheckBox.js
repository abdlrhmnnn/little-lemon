import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CheckBox = ({ options, selectedOptions, onToggleOption }) => {
  return (
    <View style={styles.checkboxGroup}>
      {options.map((option, index) => (
        <View key={index} style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              {
                backgroundColor: selectedOptions.includes(option)
                  ? "green"
                  : "white",
                borderColor: selectedOptions.includes(option)
                  ? "green"
                  : "gray",
              },
            ]}
            onPress={() => onToggleOption(option)}
          >
            {selectedOptions.includes(option) && (
              <Text style={styles.checkmark}>{"\u2713"}</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.label}>{option}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxGroup: {
    marginTop: 20,
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
  },
  checkmark: {
    color: "white",
    fontSize: 16,
  },
  label: {
    marginLeft: 10,
    fontSize: 12,
  },
});

export default CheckBox;
