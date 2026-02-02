import React from "react";
import { ImageBackground, View } from "react-native";
import { Card, Text } from "react-native-paper";

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
      <View style={{ height: 240 }}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=60",
          }}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(20,20,40,0.55)" }} />
          <View
            style={{
              position: "absolute",
              bottom: -1,
              left: 0,
              right: 0,
              height: 60,
              backgroundColor: "#F6F6F6",
              borderTopLeftRadius: 26,
              borderTopRightRadius: 26,
            }}
          />
        </ImageBackground>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: -40 }}>
        <Card style={{ borderRadius: 18 }}>
          <Card.Content style={{ gap: 10 }}>
            <View
              style={{
                alignSelf: "center",
                marginTop: -40,
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: "#5B3DF5",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 4,
                borderColor: "white",
              }}
            >
              <Text style={{ color: "white", fontWeight: "900", fontSize: 22 }}>FD</Text>
            </View>

            <Text variant="headlineSmall" style={{ fontWeight: "900", textAlign: "center" }}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={{ opacity: 0.7, textAlign: "center", marginBottom: 6 }}>
                {subtitle}
              </Text>
            ) : null}

            {children}
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}
