import "react-native-gesture-handler";

import { createStackNavigator } from "@react-navigation/stack";
import { Home } from "./Home";
import {
  AnimationScreenNames,
  allScreens,
} from "./NavigationHelpers/NavigationHelpers";

export default function YouTubeStack() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name="YouTube Demos" component={Home} />
      {allScreens.map((screen, index) => (
        <Stack.Screen
          key={index}
          name={screen.name}
          component={screen.component}
          options={
            screen.name === AnimationScreenNames.WAVE_METER ||
            screen.name === AnimationScreenNames.BENDING_CIRCLE
              ? {
                  headerTintColor: "#fff",
                  headerStyle: {
                    backgroundColor: "black",
                  },
                }
              : undefined
          }
        />
      ))}
    </Stack.Navigator>
  );
}
