import React, { useMemo, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { Button, Chip, Text } from "react-native-paper";
import { useCart } from "../../context/CartContext";
import { MenuItem } from "../../utils/types";

export default function ItemDetailsScreen({ route, navigation }: any) {
  const item: MenuItem = route.params.item;
  const { addItem } = useCart();

  const [qty, setQty] = useState(1);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const sides = item.options?.sides ?? [];
  const drinks = item.options?.drinks ?? [];
  const extras = item.options?.extras ?? [];

  const extrasTotal = useMemo(() => {
    return selectedExtras.reduce((sum, label) => {
      const found = extras.find((e) => e.label === label);
      return sum + (found?.addPrice ?? 0);
    }, 0);
  }, [selectedExtras, extras]);

  const total = useMemo(() => (Number(item.price) + extrasTotal) * qty, [item.price, extrasTotal, qty]);

  const toggle = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const goToCart = () => {
    
    navigation.navigate("Tabs", { screen: "Cart" });
  };

  const onAdd = () => {
    addItem(
      item,
      {
        sides: selectedSides,
        drink: selectedDrink ?? undefined,
        extras: selectedExtras,
      },
      qty
    );

    goToCart();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Image source={{ uri: item.imageUrl }} style={{ width: "100%", height: 220, borderRadius: 16 }} />
      <Text variant="headlineMedium" style={{ fontWeight: "900" }}>
        {item.name}
      </Text>
      <Text style={{ opacity: 0.7 }}>{item.description}</Text>

      <Text variant="titleLarge" style={{ fontWeight: "900" }}>
        R {total.toFixed(2)}
      </Text>

      {!!sides.length && (
        <View style={{ gap: 8 }}>
          <Text variant="titleMedium">Choose Sides</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {sides.map((s) => (
              <Chip
                key={s.value}
                selected={selectedSides.includes(s.value)}
                onPress={() => setSelectedSides((p) => toggle(p, s.value))}
                style={{ marginRight: 8, marginBottom: 8 }}
              >
                {s.label}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {!!drinks.length && (
        <View style={{ gap: 8 }}>
          <Text variant="titleMedium">Drink</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {drinks.map((d) => (
              <Chip
                key={d.value}
                selected={selectedDrink === d.value}
                onPress={() => setSelectedDrink(d.value)}
                style={{ marginRight: 8, marginBottom: 8 }}
              >
                {d.label}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {!!extras.length && (
        <View style={{ gap: 8 }}>
          <Text variant="titleMedium">Extras</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {extras.map((e) => (
              <Chip
                key={e.label}
                selected={selectedExtras.includes(e.label)}
                onPress={() => setSelectedExtras((p) => toggle(p, e.label))}
                style={{ marginRight: 8, marginBottom: 8 }}
              >
                {e.label} (+R{e.addPrice})
              </Chip>
            ))}
          </View>
        </View>
      )}

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
        <Button mode="outlined" onPress={() => setQty((q) => Math.max(1, q - 1))}>
          -
        </Button>
        <Text variant="titleLarge" style={{ marginHorizontal: 14, fontWeight: "900" }}>
          {qty}
        </Text>
        <Button mode="outlined" onPress={() => setQty((q) => q + 1)}>
          +
        </Button>
      </View>

      <Button mode="contained" onPress={onAdd} style={{ marginTop: 10, borderRadius: 14 }}>
        Add to Cart
      </Button>

      <Button mode="text" onPress={goToCart}>
        Go to Cart
      </Button>
    </ScrollView>
  );
}
