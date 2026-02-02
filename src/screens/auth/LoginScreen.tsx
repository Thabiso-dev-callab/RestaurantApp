import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing", "Enter email and password");
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      // ✅ No navigation here – AppNavigator should switch screens based on user role
    } catch (e: any) {
      Alert.alert("Login failed", e?.message ?? "Could not login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/burger-bg.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.55)" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
          >
            {/* Header */}
            <View style={{ alignItems: "center", marginTop: 40, marginBottom: 18 }}>
              <View
                style={{
                  height: 70,
                  width: 70,
                  borderRadius: 35,
                  backgroundColor: "#FFB703",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontWeight: "900", fontSize: 20, color: "#111" }}>BH</Text>
              </View>

              <Text
                variant="headlineMedium"
                style={{ color: "white", fontWeight: "900", marginTop: 10 }}
              >
                Burger House
              </Text>

              <Text style={{ color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
                Sign in to continue 🍔
              </Text>
            </View>

            {/* Card */}
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.95)",
                borderRadius: 18,
                padding: 14,
                gap: 10,
              }}
            >
              <Text variant="titleMedium" style={{ fontWeight: "800" }}>
                Login
              </Text>

              <TextInput
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TextInput
                mode="outlined"
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <Button
                mode="contained"
                onPress={onSubmit}
                loading={loading}
                style={{ marginTop: 10, borderRadius: 12 }}
                contentStyle={{ paddingVertical: 8 }}
              >
                Login
              </Button>

              <Button onPress={() => navigation.navigate("Register")}>
                Don&apos;t have an account? Register
              </Button>

              <Text style={{ textAlign: "center", opacity: 0.7, marginTop: 6 }}>
                Admin tip: use an email ending with @admin.com
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}
