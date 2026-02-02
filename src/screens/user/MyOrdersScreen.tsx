// src/screens/user/MyOrdersScreen.tsx
import React, { useCallback, useState } from "react";
import { View, Pressable } from "react-native";
import { Card, Text, ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { listenUserOrders } from "../../services/orders";
import { Order } from "../../utils/types";

export default function MyOrdersScreen({ navigation }: any) {
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState("");

  // ✅ Subscribe ONLY while Orders tab is focused
  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;

      setLoading(true);
      setHint("");

      const unsub = listenUserOrders(
        user.id,
        (data) => {
          setOrders(data);
          setLoading(false);
        },
        (err) => {
          console.log("listenUserOrders error:", err);
          setLoading(false);

          const msg = String(err?.message ?? "");
          if (msg.toLowerCase().includes("requires an index")) {
            setHint(
              "Firestore needs an index for (userId + createdAt). Open the link in your console logs, create the index, then come back."
            );
          } else {
            setHint("Could not load orders. Try again.");
          }
        }
      );

      return () => {
        if (typeof unsub === "function") unsub();
      };
    }, [user?.id])
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F1EE", padding: 16 }}>
      <Text variant="headlineMedium" style={{ fontWeight: "900", marginBottom: 14 }}>
        My Orders
      </Text>

      {loading ? (
        <View style={{ paddingTop: 8 }}>
          <ActivityIndicator />
          <Text style={{ opacity: 0.7, marginTop: 10 }}>Loading...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={{ gap: 10 }}>
          <Text style={{ opacity: 0.7 }}>No orders yet.</Text>
          {hint ? <Text style={{ opacity: 0.7 }}>{hint}</Text> : null}
        </View>
      ) : (
        <View style={{ gap: 14 }}>
          {orders.map((o) => (
            <Pressable key={o.id} onPress={() => navigation.navigate("OrderDetails", { orderId: o.id })}>
              <Card style={{ borderRadius: 18 }}>
                <Card.Content style={{ alignItems: "center", gap: 6 }}>
                  <Text style={{ fontWeight: "900" }}>Order #{o.id.slice(0, 6)}</Text>

                  <Text style={{ opacity: 0.8 }}>
                    Total: R {Number(o.total ?? 0).toFixed(2)}
                  </Text>

                  <Text style={{ fontWeight: "900" }}>
                    Status:{" "}
                    <Text
                      style={{
                        fontWeight: "900",
                        color:
                          o.status === "delivered"
                            ? "#1B7F3A"
                            : o.status === "preparing"
                            ? "#B45309"
                            : "#6B7280",
                      }}
                    >
                      {o.status}
                    </Text>
                  </Text>
                </Card.Content>
              </Card>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
