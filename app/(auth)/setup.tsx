import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import { router } from "expo-router";

export default function Setup() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // get current logged-in user
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        Alert.alert("Error", "No user found");
        return;
      }

      setUserId(data.user.id);
    };

    getUser();
  }, []);

  const saveUsername = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User not loaded");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      username: username.trim(),
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    router.replace("/(tabs)/home");
  };

  return (
    <View style={{ padding: 20, gap: 12 }}>

      <Text style={{ fontSize: 18, fontWeight: "600" }}>
        Choose a username
      </Text>

      <TextInput
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 8,
        }}
      />

      <Pressable
        onPress={saveUsername}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#999" : "#000",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff" }}>
          {loading ? "Saving..." : "Continue"}
        </Text>
      </Pressable>

    </View>
  );
}