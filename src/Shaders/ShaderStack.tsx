import "react-native-gesture-handler";

import { createStackNavigator } from "@react-navigation/stack";
import { Platform } from "react-native";
import { Screen } from "../Utils/Screen";
import { allScreens } from "./NavigationHelpers";
import { ShaderMenu } from "./ShaderMenu";

export default function ShaderStack() {
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
      <Stack.Screen name="Shader Menu" component={ShaderMenu} />
      {allScreens.map((screen: Screen, index: number) => {
        return (
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            key={index.toString()}
            name={screen.name}
            component={screen.component}
          />
        );
      })}
    </Stack.Navigator>
  );
}
