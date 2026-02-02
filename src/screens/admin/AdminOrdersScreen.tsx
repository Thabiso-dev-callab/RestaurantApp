import React, { useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import { Button, Card, Chip, Divider, Text } from "react-native-paper";
import { fetchAllOrders, updateOrderStatus } from "../../services/orders";
import { Order, OrderStatus } from "../../utils/types";

const money = (v: number) => `R ${Number(v ?? 0).toFixed(2)}`;

const nextStatus = (s: OrderStatus): OrderStatus => {
  if (s === "pending") return "preparing";
  if (s === "preparing") return "delivered";
  return "delivered";
};

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchAllOrders();

      
      const normalized = data.map((o) => ({
        ...o,
        status: (o.status ?? "pending") as OrderStatus,
      }));

      setOrders(normalized);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onToggleStatus = async (order: Order) => {
    const current = (order.status ?? "pending") as OrderStatus;
    const newStatus = nextStatus(current);

    try {
      setUpdatingId(order.id);
      await updateOrderStatus(order.id, newStatus);

      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
      );
    } catch (e: any) {
      Alert.alert("Update failed", e?.message ?? "Could not update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
      <View style={{ padding: 16, paddingTop: 18 }}>
        <Text variant="headlineMedium" style={{ fontWeight: "900" }}>
          Orders
        </Text>

        <View style={{ height: 10 }} />

        <Button
          mode="contained"
          onPress={load}
          loading={loading}
          disabled={loading}
          style={{ borderRadius: 12 }}
          contentStyle={{ paddingVertical: 6 }}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => {
          const status = (item.status ?? "pending") as OrderStatus;
          const isUpdating = updatingId === item.id;

          const chipBg =
            status === "delivered" ? "#E7F6ED" : status === "preparing" ? "#FFF2E5" : "#EEF2FF";
          const chipText =
            status === "delivered" ? "#1B7F3A" : status === "preparing" ? "#B45309" : "#4F46E5";

          return (
            <Card style={{ borderRadius: 16 }}>
              <Card.Content>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text variant="titleLarge" style={{ fontWeight: "900" }}>
                    Order #{String(item.id).slice(0, 6)}
                  </Text>

                  <Chip style={{ borderRadius: 999, backgroundColor: chipBg }} textStyle={{ fontWeight: "900", color: chipText }}>
                    {status}
                  </Chip>
                </View>

                <View style={{ height: 10 }} />
                <Divider />
                <View style={{ height: 10 }} />

                <Text style={{ opacity: 0.7 }}>
                  Customer:{" "}
                  <Text style={{ fontWeight: "900", opacity: 1 }}>
                    {item.customer?.name ?? ""} {item.customer?.surname ?? ""}
                  </Text>
                </Text>

                <View style={{ height: 6 }} />
                <Text style={{ opacity: 0.7 }}>
                  Phone: <Text style={{ fontWeight: "900", opacity: 1 }}>{item.customer?.phone ?? "-"}</Text>
                </Text>

                <View style={{ height: 6 }} />
                <Text style={{ opacity: 0.7 }}>
                  Address: <Text style={{ fontWeight: "900", opacity: 1 }}>{item.address ?? "-"}</Text>
                </Text>

                <View style={{ height: 10 }} />
                <Divider />
                <View style={{ height: 10 }} />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ opacity: 0.7 }}>Subtotal</Text>
                  <Text style={{ fontWeight: "900" }}>{money(item.subtotal)}</Text>
                </View>

                <View style={{ height: 6 }} />
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ opacity: 0.7 }}>Delivery</Text>
                  <Text style={{ fontWeight: "900" }}>{money(item.deliveryFee)}</Text>
                </View>

                <View style={{ height: 6 }} />
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontWeight: "900" }}>Total</Text>
                  <Text style={{ fontWeight: "900" }}>{money(item.total)}</Text>
                </View>

                <View style={{ height: 12 }} />

                <Button
                  mode="contained"
                  onPress={() => onToggleStatus(item)}
                  loading={isUpdating}
                  disabled={isUpdating}
                  style={{ borderRadius: 12 }}
                  contentStyle={{ paddingVertical: 6 }}
                >
                  Move to {nextStatus(status)}
                </Button>
              </Card.Content>
            </Card>
          );
        }}
        ListEmptyComponent={
          <View style={{ padding: 16 }}>
            <Text style={{ opacity: 0.7 }}>No orders yet.</Text>
          </View>
        }
      />
    </View>
  );
}
