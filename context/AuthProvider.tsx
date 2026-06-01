import { useContext, createContext, useEffect, useState, ReactNode } from "react";
import { supabase} from "../lib/supabase";
import { Session } from "@supabase/supabase-js";

interface AuthContextType{
    session : Session | null;
    loading : boolean;
}

interface AuthProviderProps{
    children : ReactNode;
}

// Create a global context
const authContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({children} : AuthProviderProps) => {                         
    // wrapper component that provides auth data to the whole app
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch the session as soon as the context is called.
    useEffect(() => {
        // 1. Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // 2. Listen for login/logout changes
        const { data: { subscription } } = 
            supabase.auth.onAuthStateChange((_event, session) => {
                    setSession(session);
            });

        return () => subscription.unsubscribe();
    }, [])

    return(
        // Expose session, loading to all components inside provider
        <authContext.Provider value={{session, loading}}>
            {children}
        </authContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(authContext); // Custom hook to access auth state easily.
    if(!context){
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}