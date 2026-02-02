// src/screens/user/CartScreen.tsx
import React, { useMemo } from "react";
import { Alert, ImageBackground, View } from "react-native";
import { Button, Divider, Text } from "react-native-paper";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function CartScreen({ navigation }: any) {
  const { items, subtotal, updateQty, removeItem, clearCart } = useCart();
  const { user } = useAuth();

  const total = useMemo(() => {
    return items.reduce((sum, i) => sum + i.lineTotal, 0);
  }, [items]);

  const onCheckout = () => {
    if (!items.length) {
      Alert.alert("Cart empty", "Add items to cart first.");
      return;
    }

    if (!user) {
      Alert.alert("Login required", "Please login/register before checkout.");
      return;
    }

    /**
     * ✅ CORRECT:
     * CartScreen is inside Tabs.
     * Checkout is inside UserStack.
     * So we go to the parent (UserStack) and navigate there.
     */
    const parent = navigation.getParent?.();
    if (parent?.navigate) {
      parent.navigate("Checkout");
      return;
    }

    Alert.alert("Navigation error", "Could not open Checkout screen.");
  };

  return (
    <ImageBackground
      source={require("../../../assets/burger-bg.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.55)", padding: 16 }}>
        {/* Header */}
        <View style={{ marginTop: 10, marginBottom: 12 }}>
          <Text variant="headlineMedium" style={{ color: "white", fontWeight: "900" }}>
            Your Cart
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.85)" }}>
            Review your burger order before checkout 🍔
          </Text>
        </View>

        {/* Card */}
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.95)",
            borderRadius: 18,
            padding: 14,
            gap: 10,
          }}
        >
          {items.length === 0 ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
              <Text variant="titleMedium" style={{ fontWeight: "800" }}>
                Your cart is empty
              </Text>
              <Text style={{ opacity: 0.7, textAlign: "center" }}>
                Browse the menu and add a burger to get started.
              </Text>
              <Button mode="contained" onPress={() => navigation.navigate("Home")}>
                Go to Menu
              </Button>
            </View>
          ) : (
            <>
              {/* Items */}
              <View style={{ gap: 12 }}>
                {items.map((ci) => {
                  const qty = ci.quantity;
                  const name = ci.item.name;
                  const base = ci.item.price;
                  const extras = ci.extrasTotal;
                  const line = ci.lineTotal;

                  return (
                    <View
                      key={ci.cartId}
                      style={{
                        borderWidth: 1,
                        borderColor: "rgba(0,0,0,0.08)",
                        borderRadius: 14,
                        padding: 12,
                        gap: 8,
                      }}
                    >
                      <View style={{ gap: 2 }}>
                        <Text variant="titleMedium" style={{ fontWeight: "900" }}>
                          {name}
                        </Text>

                        <Text style={{ opacity: 0.7 }}>
                          Base: R {base.toFixed(2)} • Extras: R {extras.toFixed(2)}
                        </Text>

                        <Text style={{ fontWeight: "900" }}>
                          Line Total: R {line.toFixed(2)}
                        </Text>
                      </View>

                      {/* Qty controls */}
                      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                        <Button
                          mode="outlined"
                          onPress={() => updateQty(ci.cartId, Math.max(1, qty - 1))}
                        >
                          -
                        </Button>

                        <Text style={{ fontWeight: "900" }}>Qty: {qty}</Text>

                        <Button mode="outlined" onPress={() => updateQty(ci.cartId, qty + 1)}>
                          +
                        </Button>

                        <View style={{ flex: 1 }} />

                        <Button textColor="red" onPress={() => removeItem(ci.cartId)}>
                          Remove
                        </Button>
                      </View>
                    </View>
                  );
                })}
              </View>

              <Divider />

              {/* Totals */}
              <View style={{ gap: 6 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ opacity: 0.7 }}>Subtotal</Text>
                  <Text style={{ fontWeight: "900" }}>R {subtotal.toFixed(2)}</Text>
                </View>

                <Text style={{ opacity: 0.65 }}>Delivery is added at checkout.</Text>
              </View>

              {/* Actions */}
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Button
                  mode="outlined"
                  style={{ flex: 1 }}
                  onPress={() =>
                    Alert.alert("Clear cart?", "Remove all items from cart?", [
                      { text: "Cancel", style: "cancel" },
                      { text: "Clear", style: "destructive", onPress: clearCart },
                    ])
                  }
                >
                  Clear
                </Button>

                <Button mode="contained" style={{ flex: 1 }} onPress={onCheckout}>
                  Checkout
                </Button>
              </View>
            </>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}
