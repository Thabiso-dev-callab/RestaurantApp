import React from "react";
import { Image } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { MenuItem } from "../utils/types";

export default function MenuItemCard({ item, onPress }: { item: MenuItem; onPress: () => void }) {
  return (
    <Card style={{ borderRadius: 16, overflow: "hidden", marginBottom: 12 }}>
      <Image source={{ uri: item.imageUrl }} style={{ height: 160, width: "100%" }} resizeMode="cover" />
      <Card.Content style={{ paddingTop: 12 }}>
        <Text variant="titleMedium" style={{ fontWeight: "900" }}>{item.name}</Text>
        <Text style={{ opacity: 0.7, marginTop: 3 }} numberOfLines={2}>{item.description}</Text>
        <Text style={{ marginTop: 8, fontWeight: "900", color: "#5B3DF5" }}>
          R {item.price.toFixed(2)}
        </Text>
        <Button mode="contained" onPress={onPress} style={{ marginTop: 12, borderRadius: 12, backgroundColor: "#111" }}>
          View Item
        </Button>
      </Card.Content>
    </Card>
  );
}
