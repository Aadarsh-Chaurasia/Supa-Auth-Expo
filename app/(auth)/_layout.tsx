import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/AuthProvider";

export default function AuthLayout() {
  const { session, loading } = useAuth();

  if (loading) return null;

  if (session) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}