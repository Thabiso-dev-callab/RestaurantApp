import React, { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { fetchMenu, deleteMenuItem } from "../../services/menu";
import { MenuItem } from "../../utils/types";

const BG = "#F6F1EE";
const ACCENT = "#FF6B2D";

export default function ManageMenuScreen({ navigation }: any) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchMenu();
      setItems(data);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to load menu items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [navigation]);

  const onDelete = (id: string) => {
    Alert.alert("Delete item?", "This will remove the item from the menu.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMenuItem(id);
            await load();
          } catch (e: any) {
            Alert.alert("Delete failed", e?.message ?? "Could not delete item.");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: BG }} contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
      <Text variant="headlineMedium" style={{ fontWeight: "900" }}>
        Manage Food
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Button
          mode="text"
          textColor={ACCENT}
          onPress={() => navigation.navigate("EditMenuItem", { mode: "add" })}
        >
          + Add Food
        </Button>

        <View style={{ flex: 1 }} />

        <Button mode="outlined" onPress={load} loading={loading} disabled={loading}>
          Refresh
        </Button>
      </View>

      <Card style={{ borderRadius: 18, backgroundColor: "rgba(255,255,255,0.8)" }}>
        <Card.Content style={{ gap: 10 }}>
          {items.length === 0 ? (
            <Text style={{ opacity: 0.7 }}>No items yet. Tap “+ Add Food”.</Text>
          ) : (
            items.map((it) => (
              <View
                key={it.id}
                style={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: 14,
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.05)",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontWeight: "800" }}>
                  {it.name} | R{it.price}
                </Text>

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <Text
                    style={{ color: "#3D5AFE", fontWeight: "700" }}
                    onPress={() => navigation.navigate("EditMenuItem", { mode: "edit", item: it })}
                  >
                    Edit
                  </Text>
                  <Text style={{ color: "red", fontWeight: "700" }} onPress={() => onDelete(it.id)}>
                    Delete
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
