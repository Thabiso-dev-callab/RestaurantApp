import React, { useMemo, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Button, Card, Divider, Text, TextInput } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../services/orders";


const isCardNumberValid = (v: string) => v.replace(/\s/g, "").length >= 12;
const isExpiryValid = (v: string) => /^\d{2}\/\d{2}$/.test(v); // MM/YY
const isCvvValid = (v: string) => /^\d{3,4}$/.test(v);

export default function CheckoutScreen({ navigation }: any) {
  const { user, updateProfile } = useAuth();
  const { items, subtotal, clearCart } = useCart();

  const deliveryFee = 25;
  const total = useMemo(() => (subtotal ?? 0) + deliveryFee, [subtotal]);

  
  const [address, setAddress] = useState(user?.address ?? "");
  const [cardNumber, setCardNumber] = useState(user?.card?.cardNumber ?? "");
  const [cardExpiry, setCardExpiry] = useState(user?.card?.cardExpiry ?? "");
  const [cardCvv, setCardCvv] = useState(user?.card?.cardCvv ?? "");
  const [placing, setPlacing] = useState(false);

 
  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 16, backgroundColor: "#F6F6F6" }}>
        <Card style={{ borderRadius: 16 }}>
          <Card.Content style={{ gap: 10 }}>
            <Text variant="headlineSmall" style={{ fontWeight: "900" }}>
              Login required
            </Text>
            <Text style={{ opacity: 0.7 }}>Please login to place an order.</Text>

            <Button
              mode="contained"
              onPress={() => navigation.navigate("Tabs", { screen: "Home" })}
              style={{ borderRadius: 12, backgroundColor: "#5B3DF5" }}
              contentStyle={{ paddingVertical: 8 }}
            >
              Go back
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  const onPlaceOrder = async () => {
    if (!items?.length) return Alert.alert("Cart empty", "Add items before checkout.");

    const addr = address.trim();
    if (!addr) return Alert.alert("Address required", "Enter a delivery address.");

    const cn = cardNumber.trim();
    const ex = cardExpiry.trim();
    const cv = cardCvv.trim();

    if (!isCardNumberValid(cn)) return Alert.alert("Card error", "Enter a valid card number.");
    if (!isExpiryValid(ex)) return Alert.alert("Card error", "Expiry must be MM/YY.");
    if (!isCvvValid(cv)) return Alert.alert("Card error", "CVV must be 3 or 4 digits.");

    try {
      setPlacing(true);

      
      await updateProfile({
        address: addr,
        card: {
          cardNumber: cn,
          cardExpiry: ex,
          cardCvv: cv,
        },
      });

      
      const orderId = await createOrder({
        userId: user.id,
        customer: {
          name: user.name,
          surname: user.surname,
          phone: user.phone,
          email: user.email,
        },
        address: addr,
        cartItems: items,
        subtotal: subtotal ?? 0,
        deliveryFee,
      });

      clearCart();

      Alert.alert("Order placed!", `Order #${orderId.slice(0, 6)} ✅`, [
        {
          text: "OK",
         
          onPress: () => navigation.navigate("Tabs", { screen: "Orders" }),
        },
      ]);
    } catch (e: any) {
      Alert.alert("Order failed", e?.message ?? "Could not place order.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F6F6F6" }}
      contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
    >
      <Text variant="headlineMedium" style={{ fontWeight: "900" }}>
        Checkout
      </Text>
      <Text style={{ opacity: 0.7, marginTop: 4 }}>Confirm delivery & payment.</Text>

     
      <Card style={{ borderRadius: 16, marginTop: 14 }}>
        <Card.Content style={{ gap: 10 }}>
          <Text style={{ fontWeight: "900" }}>Delivery Address</Text>
          <TextInput
            mode="outlined"
            value={address}
            onChangeText={setAddress}
            placeholder="Street, City..."
            multiline
          />
        </Card.Content>
      </Card>

      
      <Card style={{ borderRadius: 16, marginTop: 12 }}>
        <Card.Content style={{ gap: 10 }}>
          <Text style={{ fontWeight: "900" }}>Card Details</Text>

          <TextInput
            mode="outlined"
            label="Card Number"
            value={cardNumber}
            onChangeText={setCardNumber}
            placeholder="1234 5678 9012 3456"
            keyboardType="number-pad"
          />

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <TextInput
                mode="outlined"
                label="Expiry (MM/YY)"
                value={cardExpiry}
                onChangeText={setCardExpiry}
                placeholder="08/27"
              />
            </View>

            <View style={{ width: 110 }}>
              <TextInput
                mode="outlined"
                label="CVV"
                value={cardCvv}
                onChangeText={setCardCvv}
                placeholder="123"
                keyboardType="number-pad"
                secureTextEntry
              />
            </View>
          </View>

          <Text style={{ opacity: 0.6, fontSize: 12 }}>
            * Demo app: we store fake card details for the rubric.
          </Text>
        </Card.Content>
      </Card>

      {/* Totals */}
      <Card style={{ borderRadius: 16, marginTop: 12 }}>
        <Card.Content>
          <Text style={{ fontWeight: "900" }}>Totals</Text>

          <View style={{ height: 10 }} />
          <Divider />
          <View style={{ height: 10 }} />

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text>Subtotal</Text>
            <Text style={{ fontWeight: "900" }}>R {(subtotal ?? 0).toFixed(2)}</Text>
          </View>

          <View style={{ height: 8 }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text>Delivery</Text>
            <Text style={{ fontWeight: "900" }}>R {deliveryFee.toFixed(2)}</Text>
          </View>

          <View style={{ height: 10 }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontWeight: "900" }}>Total</Text>
            <Text style={{ fontWeight: "900", color: "#5B3DF5" }}>
              R {total.toFixed(2)}
            </Text>
          </View>

          <View style={{ height: 14 }} />
          <Button
            mode="contained"
            onPress={onPlaceOrder}
            loading={placing}
            disabled={placing}
            style={{ borderRadius: 12, backgroundColor: "#5B3DF5" }}
            contentStyle={{ paddingVertical: 8 }}
            icon="check"
          >
            Pay & Place Order
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
