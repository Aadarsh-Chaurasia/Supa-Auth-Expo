import { Link, Redirect } from "expo-router";
import { Text, View } from "react-native";
import { useAuth } from "@/context/AuthProvider";

export default function Index() {
  const { session, loading } = useAuth();
  
    if (loading) return null;
  
    if (session) {
      return <Redirect href="/(tabs)/home" />;
    }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/(auth)/signup">Sign Up</Link>
      <Link href="/(auth)/signin">Sign In</Link>
    </View>
  );
}
