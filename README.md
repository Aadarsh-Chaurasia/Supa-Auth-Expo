# Expo + Supabase Auth App

A simple authentication app built with Expo, Supabase, Expo Router, and NativeWind.

---

## 🚀 Features

- Email/password signup & login
- Persistent sessions (AsyncStorage)
- Auto profile creation via Supabase trigger
- Username support
- Protected navigation flow
- Clean Expo Router structure

---

## 🧱 Tech Stack

- Expo (React Native)
- Expo Router
- Supabase (Auth + Database)
- NativeWind
- AsyncStorage

---

## 📁 Project Structure
```
app/
  (auth)/
    signin.tsx
    signup.tsx
    setup.tsx

  (tabs)/
    home.tsx
    _layout.tsx

lib/
  supabase.ts

components/
  ui/   (optional reusable UI components)

.env
```


---

## ⚙️ Setup

### 1. Install dependencies

```bash
npm install
npx expo install
```

### 2. Install required packages

```bash
npm install @supabase/supabase-js nativewind
npx expo install @react-native-async-storage/async-storage
```

### 3. Create .env

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run app

```bash
npx expo start --clear
```

## 🔐 Auth Flow

```
Signup → Setup (username) → Home
Login  → Home
```

## 🧱 Database

### profiles table
```SQL
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  created_at timestamp default now()
);
```

### ⚡ Auto Profile Creation

```SQL
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
```

### 🔒 RLS Policies

```SQL
alter table public.profiles enable row level security;

create policy "read own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);
```
