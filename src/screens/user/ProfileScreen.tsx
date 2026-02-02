import React, { useEffect, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user, loading, updateProfile, logout } = useAuth();

  // ✅ hooks always run
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setSurname(user.surname ?? "");
    setPhone(user.phone ?? "");
    setAddress(user.address ?? "");
    setCardNumber(user.card?.cardNumber ?? "");
    setCardExpiry(user.card?.cardExpiry ?? "");
    setCardCvv(user.card?.cardCvv ?? "");
  }, [user]);

  if (loading) {
    return (
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text variant="headlineSmall">Loading...</Text>
      </ScrollView>
    );
  }

  // ✅ IMPORTANT: do NOT navigate/reset here
  // AppNavigator will automatically show Login/Register when user becomes null.
  if (!user) {
    return (
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text variant="headlineSmall">Signed out</Text>
        <Text style={{ opacity: 0.7, marginTop: 6 }}>
          Returning to login...
        </Text>
      </ScrollView>
    );
  }

  const onSave = async () => {
    try {
      setSaving(true);

      await updateProfile({
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

      Alert.alert("Saved", "Profile updated ✅");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const onLogout = () => {
    Alert.alert("Logout?", "You will be signed out.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            setLoggingOut(true);
            await logout();
            // ✅ NO navigation.reset / navigate / goBack
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}>
      <Text variant="headlineMedium" style={{ fontWeight: "900" }}>
        Profile
      </Text>

      <Text style={{ opacity: 0.7 }}>{user.email}</Text>

      <TextInput mode="outlined" label="Name" value={name} onChangeText={setName} />
      <TextInput mode="outlined" label="Surname" value={surname} onChangeText={setSurname} />
      <TextInput mode="outlined" label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput mode="outlined" label="Address" value={address} onChangeText={setAddress} multiline />

      <Text style={{ fontWeight: "900", marginTop: 8 }}>Card Details</Text>
      <TextInput mode="outlined" label="Card Number" value={cardNumber} onChangeText={setCardNumber} keyboardType="number-pad" />
      <TextInput mode="outlined" label="Expiry (MM/YY)" value={cardExpiry} onChangeText={setCardExpiry} />
      <TextInput mode="outlined" label="CVV" value={cardCvv} onChangeText={setCardCvv} keyboardType="number-pad" secureTextEntry />

      <Button mode="contained" onPress={onSave} loading={saving} disabled={saving} style={{ marginTop: 8 }}>
        Save
      </Button>

      <Button textColor="red" onPress={onLogout} loading={loggingOut} disabled={loggingOut}>
        Logout
      </Button>
    </ScrollView>
  );
}
