import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import { fetchAllOrders } from "../../services/orders";
import { Order } from "../../utils/types";

const BG = "#F6F1EE"; 
const ACCENT = "#FF6B2D";

function formatMoney(amount: number) {
  return `R${amount.toFixed(0)}`;
}

function MiniChart({ values }: { values: number[] }) {
 
  const max = Math.max(1, ...values);
  return (
    <View style={{ flexDirection: "row", gap: 8, alignItems: "flex-end", height: 90 }}>
      {values.map((v, idx) => (
        <View
          key={idx}
          style={{
            width: 14,
            height: Math.max(10, Math.round((v / max) * 90)),
            borderRadius: 8,
            backgroundColor: "rgba(255,107,45,0.9)",
          }}
        />
      ))}
    </View>
  );
}

export default function AdminDashboardScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchAllOrders();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, [navigation]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);

    
    const chart = orders
      .slice(0, 8)
      .reverse()
      .map((o) => o.total ?? 0);

    const padded = chart.length < 8 ? Array(8 - chart.length).fill(0).concat(chart) : chart;

    return { totalOrders, totalRevenue, chart: padded };
  }, [orders]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: BG }} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <Text variant="headlineMedium" style={{ fontWeight: "900" }}>
        Admin Dashboard
      </Text>
      <Text style={{ opacity: 0.7, marginTop: -8 }}>Welcome: {user?.email}</Text>

     
      <Card style={{ borderRadius: 18, backgroundColor: "rgba(255,255,255,0.8)" }}>
        <Card.Content style={{ gap: 10 }}>
          <Text style={{ fontWeight: "800" }}>Total Orders</Text>

          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.9)",
              borderRadius: 16,
              padding: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.05)",
            }}
          >
            <View style={{ alignItems: "center", flex: 1 }}>
              <Text style={{ opacity: 0.65 }}>Total orders</Text>
              <Text variant="headlineSmall" style={{ fontWeight: "900" }}>
                {stats.totalOrders}
              </Text>
            </View>

            <View style={{ width: 1, height: 40, backgroundColor: "rgba(0,0,0,0.08)" }} />

            <View style={{ alignItems: "center", flex: 1 }}>
              <Text style={{ opacity: 0.65 }}>Total revenue</Text>
              <Text variant="headlineSmall" style={{ fontWeight: "900" }}>
                {formatMoney(stats.totalRevenue)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      
      <Card style={{ borderRadius: 18, backgroundColor: "rgba(255,255,255,0.8)" }}>
        <Card.Content style={{ gap: 10 }}>
          <Text style={{ fontWeight: "800" }}>Sales chart</Text>

          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.9)",
              borderRadius: 16,
              padding: 14,
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.05)",
            }}
          >
            <MiniChart values={stats.chart} />
          </View>
        </Card.Content>
      </Card>

     
      <View style={{ gap: 10, marginTop: 4 }}>
        <Button
          mode="contained"
          buttonColor={ACCENT}
          style={{ borderRadius: 16 }}
          contentStyle={{ paddingVertical: 8 }}
          onPress={() => navigation.navigate("ManageMenu")}
        >
          Manage Food
        </Button>

        <Button
          mode="contained"
          buttonColor={ACCENT}
          style={{ borderRadius: 16 }}
          contentStyle={{ paddingVertical: 8 }}
          onPress={() => navigation.navigate("AdminOrders")}
        >
          View orders
        </Button>

        <Button mode="text" textColor="red" onPress={logout} loading={loading} disabled={loading}>
          Logout
        </Button>
      </View>
    </ScrollView>
  );
}
