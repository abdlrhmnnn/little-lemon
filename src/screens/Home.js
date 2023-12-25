import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import { colors, Typoghraphy, filterButtons } from "../helper";
import { Searchbar, Divider } from "react-native-paper";
import {
  createTable,
  getMenuItems,
  saveMenuItems,
  filterByQueryAndCategories,
} from "./../database";
import { getSectionListData, useUpdateEffect } from "./../utils";
import * as Crypto from "expo-crypto";
import debounce from "lodash.debounce";

const Home = () => {
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
  const [searchBarText, setSearchBarText] = useState("");
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [clickedButtons, setClickedButtons] = useState([]);

  const API_URL =
    "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";
  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const dataWithGeneratedID = data.menu.map((item) => {
        return {
          id: Crypto.randomUUID(),
          name: item.name,
          price: item.price,
          description: item.description,
          image: item.image,
          category: item.category,
        };
      });
      return dataWithGeneratedID;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchData();
        await createTable();
        let menuItems = await getMenuItems();
        if (!menuItems.length) {
          const menuItems = await fetchData();
          saveMenuItems(menuItems);
          setData(menuItems);
        } else {
          setData(menuItems);
        }
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = clickedButtons.filter((s, i) => {
        if (clickedButtons.every((item) => item === false)) {
          return true;
        }
        return clickedButtons[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        // console.log("menuItems", menuItems);
        setData(menuItems);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [clickedButtons, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);
  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);
  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleButtonClick = (buttonTitle) => {
    setClickedButtons((prevTitle) => {
      if (prevTitle.includes(buttonTitle)) {
        // Button is already clicked, remove it
        return prevTitle.filter((title) => title !== buttonTitle);
      } else {
        // Button is not clicked, add it
        return [...prevTitle, buttonTitle];
      }
    });
  };
  const renderFilterButtons = () => {
    return filterButtons.map((item) => (
      <TouchableOpacity
        key={item.id}
        style={
          clickedButtons.includes(item.title)
            ? styles.clickedfilterButton
            : styles.untouchedfilterButton
        }
        onPress={() => handleButtonClick(item.title)}
      >
        <Text
          style={
            clickedButtons.includes(item.title)
              ? styles.clickedfilterButtonText
              : styles.untouchedfilterButtonText
          }
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    ));
  };

  //   useEffect(() => {
  //     console.log("**clickedButtons**", clickedButtons);
  //   }, [clickedButtons]);

  const menuItem = (item) => {
    return (
      <TouchableOpacity style={styles.itemContainer}>
        <Text style={styles.menuItemTitle}>{item.name}</Text>
        <View style={styles.menuItem}>
          <View style={styles.textsContainer}>
            <Text style={styles.menuItemDes}>{item.description}</Text>
            <Text style={styles.menuItemPrice}>{`$${item.price}`}</Text>
          </View>
          <Image
            source={{
              uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
            }}
            style={styles.itemImage}
          />
        </View>
        <Divider
          style={{
            marginHorizontal: 16,
            color: colors.highlightBlack,
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Image source={require("../../assets/Logo.png")} />
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
      </View>
      <View style={styles.heroContainer}>
        <Text style={styles.headLine}>Little lemon</Text>
        <View style={styles.decandImageContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.subTitle}>Chicago</Text>
            <Text style={styles.decription}>
              We are a family owned Mediterranean restaurant, focused on
              traditional recipes served with a modern twist.
            </Text>
          </View>
          <Image
            source={require("../../assets/HeroImage.png")}
            style={styles.heroImage}
          />
        </View>
        <Searchbar
          placeholder="Search"
          placeholderTextColor="grey"
          onChangeText={handleSearchChange}
          value={searchBarText}
          style={styles.searchBar}
          iconColor={colors.highlightBlack}
          inputStyle={{
            color: colors.highlightBlack,
            alignSelf: "center",
          }}
        />
      </View>
      <View>
        <Text style={styles.orderText}>ORDER FOR DELIVERY!</Text>
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 16,
            paddingBottom: 10,
          }}
        >
          {renderFilterButtons()}
        </View>
      </View>
      <Divider
        style={{
          marginHorizontal: 16,
          color: colors.highlightBlack,
        }}
      />
      <FlatList
        data={data}
        renderItem={({ item }) => menuItem(item)}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  logo: {
    // Styles for your logo
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
    marginRight: 10,
    color: colors.highlightWhite,
  },
  heroImage: {
    width: 100,
    height: 120,
    borderRadius: 10,
  },
  searchBar: {
    marginTop: 20,
    marginBottom: 15,
    backgroundColor: colors.highlightWhite,
    height: 35,
  },
  orderText: {
    ...Typoghraphy.leadText,
    color: colors.highlightBlack,
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  untouchedfilterButton: {
    backgroundColor: colors.highlightWhite,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginEnd: 10,
  },
  untouchedfilterButtonText: {
    color: colors.primaryGreen,
  },
  clickedfilterButton: {
    backgroundColor: colors.primaryGreen,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginEnd: 10,
  },
  clickedfilterButtonText: {
    color: colors.highlightWhite,
  },
  itemContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  textsContainer: {
    flex: 1,
    marginEnd: 20,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  menuItemTitle: {
    ...Typoghraphy.leadText,
    color: colors.highlightBlack,
    marginBottom: 10,
  },
  menuItemDes: {
    ...Typoghraphy.leadText,
    fontSize: 14,
    color: "grey",
    marginBottom: 10,
  },
  menuItemPrice: {
    ...Typoghraphy.leadText,
    color: "#585858",
    fontSize: 15,
  },
});
