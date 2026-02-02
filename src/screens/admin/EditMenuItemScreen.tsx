import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Button, Card, Text, TextInput, Switch } from "react-native-paper";
import { addMenuItem, updateMenuItem } from "../../services/menu";
import { MenuCategory, MenuItem } from "../../utils/types";

const CATS: MenuCategory[] = ["Burgers", "Mains", "Starters", "Beverages"];

export default function EditMenuItemScreen({ navigation, route }: any) {
  const mode: "add" | "edit" = route?.params?.mode ?? "add";
  const existing: MenuItem | undefined = route?.params?.item;

  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [price, setPrice] = useState(String(existing?.price ?? ""));
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl ?? "");
  const [category, setCategory] = useState<MenuCategory>(existing?.category ?? "Burgers");
  const [isAvailable, setIsAvailable] = useState(existing?.isAvailable ?? true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions?.({ title: mode === "add" ? "Add Food" : "Edit Food" });
  }, [mode]);

  const parsedPrice = useMemo(() => Number(price), [price]);

  const onSave = async () => {
    if (!name.trim()) return Alert.alert("Missing", "Name is required");
    if (!description.trim()) return Alert.alert("Missing", "Description is required");
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0)
      return Alert.alert("Invalid", "Price must be a number > 0");
    if (!imageUrl.trim()) return Alert.alert("Missing", "Image URL is required");

    try {
      setSaving(true);

      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        imageUrl: imageUrl.trim(),
        category,
        isAvailable,
      };

      if (mode === "add") {
        await addMenuItem(payload as any);
      } else {
        await updateMenuItem(existing!.id, payload as any);
      }

      Alert.alert("Saved ✅", mode === "add" ? "Item added to menu." : "Item updated.");
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Could not save item");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F6F1EE" }} contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
      <Text variant="headlineMedium" style={{ fontWeight: "900" }}>
        {mode === "add" ? "Add Food" : "Edit Food"}
      </Text>

      <Card style={{ borderRadius: 18, marginTop: 14 }}>
        <Card.Content style={{ gap: 12 }}>
          <TextInput mode="outlined" label="Name" value={name} onChangeText={setName} />
          <TextInput
            mode="outlined"
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TextInput
            mode="outlined"
            label="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <TextInput
            mode="outlined"
            label="Image URL"
            value={imageUrl}
            onChangeText={setImageUrl}
          />

          <View style={{ gap: 8 }}>
            <Text style={{ fontWeight: "900" }}>Category</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {CATS.map((c) => (
                <Text
                  key={c}
                  onPress={() => setCategory(c)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 999,
                    backgroundColor: category === c ? "#000" : "#EEE",
                    color: category === c ? "#FFF" : "#000",
                    fontWeight: "900",
                  }}
                >
                  {c}
                </Text>
              ))}
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontWeight: "900" }}>Available</Text>
            <Switch value={isAvailable} onValueChange={setIsAvailable} />
          </View>

          <Button
            mode="contained"
            onPress={onSave}
            loading={saving}
            disabled={saving}
            style={{ borderRadius: 14, backgroundColor: "#FF6B2D" }}
            contentStyle={{ paddingVertical: 8 }}
          >
            Save
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
