import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./app/screens/Login";
import List from "./app/screens/List";
import Settings from "./app/screens/Settings";
import AddToDo from "./app/screens/AddToDo";
import { use, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FirebaseAuth } from "./FirebaseConfig";
import { View } from "react-native";
import CompletedTasks from "./app/screens/CompletedTasks";

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <View style={{ flex: 1, marginTop: 40 }}>
    <InsideStack.Navigator screenOptions={{ headerShown: false }}>
      <InsideStack.Screen name="List" component={List} />
      <InsideStack.Screen name="Settings" component={Settings} />
      <InsideStack.Screen name="AddToDo" component={AddToDo} />
      <InsideStack.Screen name="CompletedTasks" component={CompletedTasks} />
    </InsideStack.Navigator>
    </View>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FirebaseAuth, (user) => {
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="Home"
            component={InsideLayout}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
