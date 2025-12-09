import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, StyleSheet, Button, ScrollView } from "react-native";
import ExpenseTrackingScreen from "./src/screens/ExpenseTrackerScreen";
import BudgetScreen from "./src/screens/BudgetScreen";
import SpendingBreakdown from "./src/screens/SpendingBreakdown";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Test user ID
const CURRENT_USER_ID = "user-123";

// Temporary screens
function LoginScreen({ navigation }: any){
  return (
    <View style={styles.center}>
      <Text>Login Screen</Text>
      {/*button to check the other tabs for now, delete later*/}
      <Button
        title ="App"
        onPress={() => navigation.navigate("MainTabs")}
      />
    </View>
  );
}

function SearchFilterScreen() {
  return (
    <View style={styles.center}>
      <Text>Search & Filter Screen</Text>
    </View>
  );
}

function AppInfoScreen() {
  return (
    <ScrollView style={styles.infoContainer}>
      <Text style={styles.infoTitle}>Budget App 💰</Text>

      <Text style={styles.sectionTitle}>Purpose</Text>
      <Text style={styles.infoText}>
        This app helps you manage your personal finances by tracking expenses,
        setting budgets, and analyzing your spending patterns.
      </Text>

      <Text style={styles.sectionTitle}>Features</Text>
      <Text style={styles.infoText}>• Track daily expenses</Text>
      <Text style={styles.infoText}>• Set monthly budgets per category</Text>
      <Text style={styles.infoText}>• Search and filter transactions</Text>
      <Text style={styles.infoText}>• View spending breakdown</Text>
      <Text style={styles.infoText}>• Get alerts when over budget</Text>
      
      <Text style={styles.sectionTitle}>How to Use</Text>
      <Text style={styles.infoText}>
        1. Add your expenses in the "Expenses" tab{'\n'}
        2. Set budgets in the "Budget" tab{'\n'}
        3. View your spending in the "Breakdown" tab{'\n'}
        4. Get notified if you go over budget!
      </Text>
    </ScrollView>
  );
}

// Bottom tab navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#4caf50",
        tabBarInactiveTintColor: "#999",
        headerStyle: { backgroundColor: "#4caf50" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Tab.Screen
        name="TrackExpenses"
        component={ExpenseTrackingScreen}
        options={{
          title: "Expense Tracker",
          tabBarLabel: "Expenses",
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>💵</Text>,
        }}
      />

      <Tab.Screen
        name="Budget"
        options={{
          title: "Budget",
          tabBarLabel: "Budget",
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>📊</Text>,
          headerShown: false,
        }}
      >
        {() => <BudgetScreen userId={CURRENT_USER_ID} />}
      </Tab.Screen>

      <Tab.Screen
        name="Breakdown"
        options={{
          title: "Breakdown",
          tabBarLabel: "Breakdown",
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>📈</Text>,
          headerShown: false,
        }}
      >
        {() => <SpendingBreakdown userId={CURRENT_USER_ID} />}
      </Tab.Screen>

      <Tab.Screen
        name="Search"
        component={SearchFilterScreen}
        options={{
          title: "Search & Filter",
          tabBarLabel: "Search",
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🔍</Text>,
        }}
      />

      <Tab.Screen
        name="Info"
        component={AppInfoScreen}
        options={{
          title: "App Info",
          tabBarLabel: "Info",
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>ℹ️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      {/*no bottom tab for login screen*/}
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#4caf50" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />

        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    backgroundColor: "#e8f5e9",
    padding: 20,
  },
  infoTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1b5e20",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e7d32",
    marginTop: 20,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    lineHeight: 24,
  },
});