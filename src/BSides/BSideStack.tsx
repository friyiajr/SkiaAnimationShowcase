import "react-native-gesture-handler";

import { createStackNavigator } from "@react-navigation/stack";
import GranTurismo from "./GranTurismo";
import { BSideMenu } from "./BSideMenu";
import { Platform } from "react-native";

export default function BSideStack() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerStyle: {
          backgroundColor: "black",
        },
        presentation: Platform.OS === "android" ? "modal" : undefined,
      }}
    >
      <Stack.Screen name="B-Side Menu" component={BSideMenu} />
      <Stack.Screen name="Gran Turismo Countdown 🏎" component={GranTurismo} />
    </Stack.Navigator>
  );
}
