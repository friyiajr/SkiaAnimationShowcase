import "react-native-gesture-handler";

import { createStackNavigator } from "@react-navigation/stack";
import { Platform } from "react-native";
import { Screen } from "../Utils/Screen";
import { BSideMenu } from "./BSideMenu";
import { allScreens } from "./NavigationHelpers";

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
      {allScreens.map((screen: Screen, index: number) => {
        return (
          <Stack.Screen
            key={index.toString()}
            name={screen.name}
            component={screen.component}
          />
        );
      })}
    </Stack.Navigator>
  );
}
