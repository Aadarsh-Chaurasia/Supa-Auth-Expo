import { supabase } from "@/lib/supabase";
import {router} from "expo-router";

const handleLogout = async () => {
    const {error} = await supabase.auth.signOut();
    if(!error){
        router.replace("/(auth)/signin");
    }
}

export default handleLogout;