// src/navigation/AppNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

import HomeScreen from "../screens/user/HomeScreen";
import CartScreen from "../screens/user/CartScreen";
import ProfileScreen from "../screens/user/ProfileScreen";
import ItemDetailsScreen from "../screens/user/ItemDetailsScreen";
import CheckoutScreen from "../screens/user/CheckoutScreen";
import EditCartItemScreen from "../screens/user/EditCartItemScreen";
import MyOrdersScreen from "../screens/user/MyOrdersScreen";
import OrderDetailsScreen from "../screens/user/OrderDetailsScreen";

import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import ManageMenuScreen from "../screens/admin/ManageMenuScreen";
import EditMenuItemScreen from "../screens/admin/EditMenuItemScreen";
import AdminOrdersScreen from "../screens/admin/AdminOrdersScreen";

import { useAuth } from "../context/AuthContext";

type RootStackParamList = {
  AuthStack: undefined;
  UserStack: undefined;
  AdminStack: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator();
const UserStack = createNativeStackNavigator();
const AdminStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function UserTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#FF6B2D",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: { height: 64, paddingBottom: 10, paddingTop: 10 },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, any> = {
            Home: "home",
            Cart: "cart",
            Orders: "receipt",
            Profile: "person",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Cart" component={CartScreen} />
      <Tabs.Screen name="Orders" component={MyOrdersScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

function UserStackNavigator() {
  return (
    <UserStack.Navigator screenOptions={{ headerShown: false }}>
      <UserStack.Screen name="Tabs" component={UserTabs} />
      <UserStack.Screen name="ItemDetails" component={ItemDetailsScreen} />
      <UserStack.Screen name="EditCartItem" component={EditCartItemScreen} />
      <UserStack.Screen name="Checkout" component={CheckoutScreen} />
      <UserStack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    </UserStack.Navigator>
  );
}

function AdminStackNavigator() {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminStack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <AdminStack.Screen name="ManageMenu" component={ManageMenuScreen} />
      <AdminStack.Screen name="EditMenuItem" component={EditMenuItemScreen} />
      <AdminStack.Screen name="AdminOrders" component={AdminOrdersScreen} />
    </AdminStack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <RootStack.Screen name="AuthStack" component={AuthStackNavigator} />
      ) : user.role === "admin" ? (
        <RootStack.Screen name="AdminStack" component={AdminStackNavigator} />
      ) : (
        <RootStack.Screen name="UserStack" component={UserStackNavigator} />
      )}
    </RootStack.Navigator>
  );
}
