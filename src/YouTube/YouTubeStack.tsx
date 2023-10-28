import "react-native-gesture-handler";

import { createStackNavigator } from "@react-navigation/stack";
import { Home } from "./Home";
import {
  AnimationScreenNames,
  allScreens,
} from "./NavigationHelpers/NavigationHelpers";

export default function YouTubeStack() {
  const Stack = createStackNavigator();

  const getScreenConfig = (screen: string) => {
    switch (screen) {
      case AnimationScreenNames.WAVE_METER:
      case AnimationScreenNames.BENDING_CIRCLE:
        return {
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "black",
          },
        };
      case AnimationScreenNames.GRADIENT_CLOCK:
        return {
          headerShown: false,
        };
      default:
        return undefined;
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen name="YouTube Demos" component={Home} />
      {allScreens.map((screen, index) => (
        <Stack.Screen
          key={index}
          name={screen.name}
          component={screen.component}
          options={getScreenConfig(screen.name)}
        />
      ))}
    </Stack.Navigator>
  );
}
