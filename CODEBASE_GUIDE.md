# Complete Beginner Guide: Uloom e Deeniya Website Architecture & Flow

This guide explains everything about your website **Uloom e Deeniya** in simple English so you have complete control over your code, database, authentication, news system, Google OAuth, and Vercel deployment.

---

## 1. How to See Which Supabase Database is Connected

Your website connects to Supabase using configuration variables stored in your environment file.

### Environment File (`.env`)
Open [`.env`](file:///C:/Users/ACER/.gemini/antigravity/scratch/uloomedeeniya/.env) in your project root:

```env
SUPABASE_PROJECT_ID="cfxzgqnjrtbdvimzomxe"
SUPABASE_PUBLISHABLE_KEY="sb_publishable_HSx-Aph4hnGJpErL9GY0VQ_bakLeGFP"
SUPABASE_URL="https://cfxzgqnjrtbdvimzomxe.supabase.co"
```

- **Project ID:** `cfxzgqnjrtbdvimzomxe`
- **Database URL:** `https://cfxzgqnjrtbdvimzomxe.supabase.co`

---

## 2. How Google Sign-In Works & Setup Steps

We updated [`src/routes/auth.tsx`](file:///C:/Users/ACER/.gemini/antigravity/scratch/uloomedeeniya/src/routes/auth.tsx) to use native `supabase.auth.signInWithOAuth({ provider: 'google' })`.

### To activate Google Sign-In on your domain & Vercel:

1. **Get Credentials from Google Cloud Console:**
   - Open [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials).
   - Create an **OAuth 2.0 Client ID** (*Web Application* type).
   - Add Authorized Redirect URI:
     `https://cfxzgqnjrtbdvimzomxe.supabase.co/auth/v1/callback`

2. **Configure Supabase Provider:**
   - Open [Supabase Dashboard](https://supabase.com/dashboard/project/cfxzgqnjrtbdvimzomxe).
   - Go to **Authentication** -> **Providers** -> **Google**.
   - Enable Google provider, enter Client ID & Client Secret, and click **Save**.

3. **Add Redirect URLs in Supabase:**
   - Under **Authentication** -> **URL Configuration**:
   - Set **Site URL** to your Vercel URL (e.g. `https://uloomedeeniya.vercel.app`).
   - Add Redirect URLs: `http://localhost:8080/auth`, `https://*.vercel.app/auth`.

---

## 3. How to Deploy to Vercel

1. **Push Changes to GitHub:**
   ```bash
   git add .
   git commit -m "Add native Google Auth and vercel.json config"
   git push origin main
   ```

2. **Import in Vercel:**
   - Log into [vercel.com](https://vercel.com) with GitHub.
   - Click **Add New...** -> **Project** -> Select `affankamran-hub/uloomedeeniya`.

3. **Set Environment Variables in Vercel:**
   - `VITE_SUPABASE_URL`: `https://cfxzgqnjrtbdvimzomxe.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: `sb_publishable_HSx-Aph4hnGJpErL9GY0VQ_bakLeGFP`
   - `VITE_SUPABASE_PROJECT_ID`: `cfxzgqnjrtbdvimzomxe`
   - `SUPABASE_URL`: `https://cfxzgqnjrtbdvimzomxe.supabase.co`
   - `SUPABASE_PUBLISHABLE_KEY`: `sb_publishable_HSx-Aph4hnGJpErL9GY0VQ_bakLeGFP`

4. **Deploy:** Click **Deploy**. Vercel will publish your live website!
