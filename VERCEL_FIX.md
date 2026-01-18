# 🚨 CRITICAL DEPLOYMENT STEP

To fix the "Internal Server Error" and "MONGODB_URI missing" error, you **MUST** configure Vercel manually.
For security reasons, we cannot push the `.env` file to GitHub (it would expose your password to hackers).

## ⚡ How to Fix in 60 Seconds:

1.  **Click this link**: [Open Vercel Dashboard](https://vercel.com/dashboard)
2.  Click on your project: **construction**
3.  Click **Settings** (top tab) → **Environment Variables** (left menu).
4.  Add this variable:

    *   **Key**: `MONGODB_URI`
    *   **Value**: `mongodb+srv://Vercel-Admin-construction_website:RWqGjOIbFEEcUspJ@construction-website.xnp4jng.mongodb.net/?retryWrites=true&w=majority`

5.  Click **Save**.
6.  **IMPORTANT**: Go to the **Deployments** tab and click **Redeploy** on the latest commit.

The app will not work until this is done.
