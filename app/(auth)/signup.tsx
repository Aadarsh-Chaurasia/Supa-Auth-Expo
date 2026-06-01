import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import {router} from "expo-router";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    console.log("Logged in :", data);

    setLoading(false);

    if (error) {
      Alert.alert("Signup failed", error.message);
      return;
    }

    Alert.alert(
      "Success",
      "Check your email to confirm your account (if email confirmation is enabled)."
    );

    console.log("User:", data.user);
    router.replace("/(auth)/setup"); 
  };

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>Create account</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          padding: 12,
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          padding: 12,
          borderRadius: 8,
        }}
      />

      <Pressable
        onPress={handleSignup}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#999" : "#000",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff" }}>
          {loading ? "Creating..." : "Sign up"}
        </Text>
      </Pressable>
    </View>
  );
}