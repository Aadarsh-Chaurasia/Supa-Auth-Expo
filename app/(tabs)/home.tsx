import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthProvider";
import handleLogout from "../utils/handleLogout";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";





export default function Home() {
  const { session } = useAuth();
  const [username, setUsername] = useState<string>("");

  // console.log(session)

  useEffect(() => {
    const getUserName = async (userid:string | undefined) => {
      const {data} = await supabase
                            .from("profiles")
                            .select("username")
                            .eq("id", userid)
                            .single();
      const user_name = data?.username ?? null
      setUsername(user_name);
      console.log("\n\n\n##### Username :",user_name )
    }
    getUserName(session?.user?.id);
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24 }}>
          Welcome {username}👋
        </Text>

        <Text style={{ marginTop: 10 }}>
          {session?.user?.email}
        </Text>

        <TouchableOpacity
          onPress={handleLogout}
          style={{
            marginTop: 30,
            backgroundColor: "red",
            padding: 14,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}