import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Card, Divider, Text } from "react-native-paper";
import { fetchOrderById } from "../../services/orders";
import { Order } from "../../utils/types";

export default function OrderDetailsScreen({ route }: any) {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrderById(orderId).then(setOrder);
  }, [orderId]);

  if (!order) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading order...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F1EE", padding: 16 }}>
      <Text variant="headlineMedium" style={{ fontWeight: "900", marginBottom: 14 }}>
        Order #{order.id.slice(0, 6)}
      </Text>

      <Card style={{ borderRadius: 18 }}>
        <Card.Content style={{ gap: 8 }}>
          <Text>Status: <Text style={{ fontWeight: "900" }}>{order.status}</Text></Text>
          <Divider />

          <Text>Delivery Address</Text>
          <Text style={{ fontWeight: "900" }}>{order.address}</Text>

          <Divider />

          <Text>Total</Text>
          <Text style={{ fontWeight: "900" }}>R {order.total.toFixed(2)}</Text>
        </Card.Content>
      </Card>
    </View>
  );
}
