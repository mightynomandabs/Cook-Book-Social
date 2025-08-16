# 🚀 Netlify Deployment Guide

## **Step 1: Build Your App**
```bash
npm run build
```

## **Step 2: Deploy to Netlify**

### **Option A: Drag & Drop (Quick)**
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Drag your `build` folder to the deploy area
4. Your app will be live instantly!

### **Option B: Git Integration (Recommended)**
1. Push your code to GitHub
2. Connect your GitHub repo to Netlify
3. Netlify will auto-deploy on every push

## **Step 3: Update Google OAuth Settings**

### **In Google Cloud Console:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Update **Authorized JavaScript origins:**
   - Add your Netlify domain (e.g., `https://your-app.netlify.app`)
5. Update **Authorized redirect URIs:**
   - Keep: `https://cxkllgtahdbrkkgphqql.supabase.co/auth/v1/callback`
   - Add: `https://your-app.netlify.app/auth/callback`

### **In Supabase Dashboard:**
1. Go to **Authentication** → **Settings**
2. Update **Site URL** to your Netlify domain
3. Save changes

## **Step 4: Test Your App**
1. Visit your Netlify URL
2. Test Google OAuth sign-in
3. Verify user data saves to Supabase

## **Benefits of Netlify:**
- ✅ **Faster builds** than Vercel
- ✅ **Better React support**
- ✅ **Automatic HTTPS**
- ✅ **Global CDN**
- ✅ **Form handling** (if needed later)
- ✅ **Functions** (serverless)

## **Troubleshooting:**
- If you get 404 errors, check the `netlify.toml` file
- Make sure `build` folder is generated before deploying
- Verify Google OAuth redirect URIs are correct
