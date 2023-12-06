import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";

import { createStackNavigator } from "@react-navigation/stack";

import YouTubeStack from "./src/YouTube/YouTubeStack";
import BSideStack from "./src/BSides/BSideStack";
import { HomeScreen } from "./src/Home";
import { Platform } from "react-native";
import ShaderStack from "./src/Shaders/ShaderStack";

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          presentation: Platform.OS === "android" ? "modal" : undefined,
        }}
      >
        <Stack.Screen name="Menu" component={HomeScreen} />
        <Stack.Screen name="B-Side Nav 💿" component={BSideStack} />
        <Stack.Screen name="YouTube Demos 🎥" component={YouTubeStack} />
        <Stack.Screen name="YouTube Shaders 🖍" component={ShaderStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
