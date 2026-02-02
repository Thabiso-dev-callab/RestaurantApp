import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { useCart } from "../../context/CartContext";
import { CartSelection } from "../../utils/types";

export default function EditCartItemScreen({ route, navigation }: any) {
  const { cartId } = route.params;
  const { items, editItem } = useCart();

  const cartItem = useMemo(() => items.find((x) => x.cartId === cartId), [items, cartId]);

  const [qty, setQty] = useState(cartItem?.quantity ?? 1);

  // if missing (deleted)
  if (!cartItem) {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
        <Text>Item not found.</Text>
        <Button onPress={() => navigation.goBack()}>Go Back</Button>
      </View>
    );
  }

  // ✅ selection always defined for editing
  const selection: CartSelection = cartItem.selection ?? { extras: [] };

  const onSave = () => {
    editItem(cartItem.cartId, selection, qty);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F6F6", padding: 16 }}>
      <Text variant="headlineSmall" style={{ fontWeight: "900" }}>
        Edit Item
      </Text>

      <Card style={{ borderRadius: 16, marginTop: 14 }}>
        <Card.Content style={{ gap: 12 }}>
          <Text style={{ fontWeight: "900" }}>{cartItem.item.name}</Text>
          <Text style={{ opacity: 0.7 }}>Base: R {cartItem.item.price.toFixed(2)}</Text>

          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Button mode="outlined" onPress={() => setQty((q) => Math.max(1, q - 1))}>
              -
            </Button>
            <Text style={{ fontWeight: "900" }}>Qty: {qty}</Text>
            <Button mode="outlined" onPress={() => setQty((q) => q + 1)}>
              +
            </Button>
          </View>

          <Button mode="contained" onPress={onSave} style={{ borderRadius: 12, marginTop: 8 }}>
            Save
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}
