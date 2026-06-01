#supabase #react-native
# 1. Supabase With react-native (Expo)

## 1. initial setup

Setup Expo
```bash
npx create-expo-app@latest --template default@sdk-54
npx run reset-project
npx expo start
```
Setup Supabase
```bash
npm install @supabase/supabase-js
npx expo install @react-native-async-storage/async-storage
```
---

## 2. Configure `lib/supabase.ts`
```ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);
```
We need async-storage to store access token, refresh tokens, user session data. It is equivalent of `localstorage` on web. Without storage, user will be logged out everytime app is closed. `persistentSession: true` supabase to save the details in AsyncStorage and reload it whenever app opens again.
---

## 3. SignUp

When user clicks `Create account` button (which is a Pressable), `handleSignUp` function is called that, 
	first validates the data -> start loading -> send data to supabase and record response -> stop loading -> handle error if any, else redirect to OnBorading or setup page.
```jsx
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
```
---

## 4. Create profile in supabase

1. Open SQL editor -> 
```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text
);
```
2. then add RLS -> using Table editor
3. Allow user to read/write their own profile
```sql
create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);
```
---

## 5. OnBoarding

get user details and save them to DB.
```tsx
// Validate the username. i.e., username should not be empty etc.

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

router.replace("/(tabs)/home"); // Reroute to home after setup
```
---

## 6. SignIn

Similar to Signup just instead of `supabase.auth.signUp()`, we use `signInWithPassword()`
```tsx
setLoading(true);
const { data, error } = await supabase.auth.signInWithPassword({
	email,
	password,
});
setLoading(false);
```
then route it to home.
---

## 7. Home

We will display "Hii, username", for this we will retrieve data from `Profiles` table.

```tsx
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
```
---

