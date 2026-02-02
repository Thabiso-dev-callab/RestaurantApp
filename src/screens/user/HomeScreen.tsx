import React, { useEffect, useMemo, useState } from "react";
import { ImageBackground, Pressable, ScrollView, View } from "react-native";
import { ActivityIndicator, Card, Chip, Text } from "react-native-paper";
import { fetchMenu, filterByCategory } from "../../services/menu";

import type { MenuCategory, MenuItem } from "../../utils/types";

const CATS: MenuCategory[] = ["Burgers", "Mains", "Starters", "Beverages"];

export default function HomeScreen({ navigation }: any) {
  const [category, setCategory] = useState<MenuCategory>("Burgers");
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const list = useMemo(() => {
    return menu.filter(
      (i) => i.category === category && (i.isAvailable ?? true)
    );
  }, [menu, category]);

  const load = async () => {
    setLoading(true);
    try {
      const items = await fetchMenu();
      setMenu(items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Hero */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=80",
        }}
        style={{ height: 210, justifyContent: "flex-end" }}
      >
        <View style={{ padding: 16, backgroundColor: "rgba(0,0,0,0.35)" }}>
          <Text
            variant="headlineMedium"
            style={{ color: "white", fontWeight: "900" }}
          >
            Burger House 🍔
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.9)" }}>
            Fresh burgers delivered fast
          </Text>
        </View>
      </ImageBackground>

      {/* Categories */}
      <View style={{ paddingHorizontal: 12, paddingTop: 12 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
        >
          {/* ✅ avoid "gap" issues by using marginRight */}
          <View style={{ flexDirection: "row" }}>
            {CATS.map((c, idx) => (
              <Chip
                key={c}
                selected={category === c}
                onPress={() => setCategory(c)}
                style={{
                  backgroundColor: category === c ? "#000" : "#F1F1F1",
                  marginRight: idx === CATS.length - 1 ? 0 : 10,
                }}
                textStyle={{
                  color: category === c ? "#fff" : "#000",
                  fontWeight: "800",
                }}
              >
                {c}
              </Chip>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* List */}
      <View style={{ padding: 12, paddingBottom: 30 }}>
        {loading ? (
          <View style={{ paddingTop: 20 }}>
            <ActivityIndicator />
          </View>
        ) : list.length === 0 ? (
          <Text style={{ textAlign: "center", paddingTop: 30, opacity: 0.7 }}>
            No items available in this category.
          </Text>
        ) : (
          // ✅ avoid "gap" issues by using marginBottom
          <View style={{ paddingTop: 12 }}>
            {list.map((item) => {
              const price = Number(item.price); // ✅ safe if Firestore stored string
              return (
                <Pressable
                  key={item.id}
                  onPress={() => navigation.navigate("ItemDetails", { item })}
                  style={{ marginBottom: 12 }}
                >
                  <Card style={{ borderRadius: 16, overflow: "hidden" }}>
                    <Card.Cover source={{ uri: item.imageUrl }} />
                    <Card.Content style={{ paddingTop: 10 }}>
                      <Text variant="titleMedium" style={{ fontWeight: "900" }}>
                        {item.name}
                      </Text>

                      <Text style={{ opacity: 0.7 }} numberOfLines={2}>
                        {item.description}
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: 8,
                        }}
                      >
                        <Text style={{ fontWeight: "900" }}>
                          R {Number.isFinite(price) ? price.toFixed(2) : "0.00"}
                        </Text>

                        <Text style={{ opacity: 0.6 }}>
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </Text>
                      </View>
                    </Card.Content>
                  </Card>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
