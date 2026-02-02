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

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email.trim() || !password.trim()) return Alert.alert("Missing", "Enter email and password.");
    if (!name.trim() || !surname.trim()) return Alert.alert("Missing", "Enter name and surname.");

    try {
      setLoading(true);
      await register({
        email: email.trim(),
        password,
        name: name.trim(),
        surname: surname.trim(),
        phone: phone.trim(),
        address: address.trim(),
        card: {
          cardNumber: cardNumber.trim(),
          cardExpiry: cardExpiry.trim(),
          cardCvv: cardCvv.trim(),
        },
      } as any);

      Alert.alert("Success", "Account created ✅");
    } catch (e: any) {
      Alert.alert("Register failed", e?.message ?? "Could not register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/burger-bg.jpg")} // ✅ add your burger image here
      style={{ flex: 1 }}
      blurRadius={2}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.55)" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          >
            {/* Header */}
            <View style={{ alignItems: "center", marginTop: 22, marginBottom: 18 }}>
              <View
                style={{
                  height: 64,
                  width: 64,
                  borderRadius: 32,
                  backgroundColor: "#FFB703",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontWeight: "900", fontSize: 18, color: "#111" }}>BH</Text>
              </View>

              <Text
                variant="headlineMedium"
                style={{ color: "white", fontWeight: "900", marginTop: 10 }}
              >
                Burger House
              </Text>

              <Text style={{ color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
                Create your account to order 🍔
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
                Account
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

              <Text variant="titleMedium" style={{ fontWeight: "800", marginTop: 8 }}>
                Contact Details
              </Text>

              <TextInput mode="outlined" label="Name" value={name} onChangeText={setName} />
              <TextInput mode="outlined" label="Surname" value={surname} onChangeText={setSurname} />
              <TextInput
                mode="outlined"
                label="Contact Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <TextInput mode="outlined" label="Address" value={address} onChangeText={setAddress} />

              <Text variant="titleMedium" style={{ fontWeight: "800", marginTop: 8 }}>
                Card Details
              </Text>

              <TextInput
                mode="outlined"
                label="Card Number"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="number-pad"
              />
              <TextInput
                mode="outlined"
                label="Expiry (MM/YY)"
                value={cardExpiry}
                onChangeText={setCardExpiry}
              />
              <TextInput
                mode="outlined"
                label="CVV"
                value={cardCvv}
                onChangeText={setCardCvv}
                keyboardType="number-pad"
                secureTextEntry
              />

              <Button
                mode="contained"
                onPress={onSubmit}
                loading={loading}
                style={{ marginTop: 10, borderRadius: 12 }}
                contentStyle={{ paddingVertical: 8 }}
              >
                Create Account
              </Button>

              <Button onPress={() => navigation.navigate("Login")}>
                Already have an account? Login
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
