import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  SafeAreaView,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { useNavigation } from "@react-navigation/native";
import { AnimationScreenNames } from "../NavigationHelpers";

export const BSideMenu = () => {
  const nav = useNavigation<any>();

  const goToScreen = (name: string) => {
    nav.push(name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={Object.values(AnimationScreenNames)}
        renderItem={({ item }) => {
          return (
            <Pressable onPress={() => goToScreen(item)} style={styles.button}>
              <View style={styles.exampleCell}>
                <Text style={styles.cellText}>{item}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  button: {
    height: 100,
    backgroundColor: "black",
  },
  cellText: {
    color: "white",
  },
  exampleCell: {
    borderRadius: 8,
    marginHorizontal: 30,
    marginVertical: 8,
    backgroundColor: "black",
    flex: 1,
    shadowColor: Platform.OS === "ios" ? "darkgrey" : "white",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
