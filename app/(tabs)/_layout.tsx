import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/AuthProvider";
import { View, ActivityIndicator } from "react-native";

export default function AppLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/signin" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}