import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { supabase } from "../../lib/supabase";

export default function Home() {
  const [username, setUsername] = useState<string>("User");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();

      const user = userData.user;
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      setUsername(data?.username ?? "User");
    };

    fetchProfile();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>
        Hello, {username}
      </Text>
    </View>
  );
}