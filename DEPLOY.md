# Deploying the E-commerce Search API

Your app is a **Node.js + Express** API with **MongoDB**. Below are simple ways to deploy it.

---

## 1. Prepare the app (already done)

- **PORT** and **MONGODB_URI** are read from environment variables.
- **Start command:** `npm start` (runs `node src/server.js`).

---

## 2. Database: MongoDB Atlas (cloud)

Use a free MongoDB in the cloud so the deployed app can connect from anywhere.

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a **free cluster** (e.g. M0).
3. **Database Access** → Add user (username + password). Note the password.
4. **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) so your hosted app can connect.
5. **Database** → **Connect** → **Drivers** → copy the connection string. It looks like:
   ```text
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your user password and set `<dbname>` to e.g. `ecommerce-search`.

**Local `.env` (optional, for testing):**

```env
PORT=3000
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/ecommerce-search?retryWrites=true&w=majority
```

---

## 3. Deploy the API

### Option A: Render (free tier, easy)

1. Push your code to **GitHub** (ensure `node_modules` and `.env` are in `.gitignore`).
2. Go to [render.com](https://render.com) → Sign up with GitHub.
3. **New** → **Web Service**.
4. Connect your repo and set:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Environment variables:**
     - `MONGODB_URI` = your Atlas connection string  
     - (Render sets `PORT` automatically.)
5. Deploy. Your API URL will be like `https://your-app-name.onrender.com`.

**API base URL:** `https://your-app-name.onrender.com/api/v1`

- Search: `GET /api/v1/search/product?query=iphone`
- Get metadata: `GET /api/v1/product/meta-data?productId=...`
- Update metadata: `PUT /api/v1/product/meta-data` with JSON body.

---

### Option B: Railway

1. Go to [railway.app](https://railway.app) → Login with GitHub.
2. **New Project** → **Deploy from GitHub** → select your repo.
3. In the service → **Variables** → add:
   - `MONGODB_URI` = your Atlas connection string
4. Railway sets `PORT` automatically. Ensure **Start Command** is `npm start` (or leave default).
5. **Settings** → **Generate Domain** to get a public URL.

---

### Option C: Fly.io

1. Install [flyctl](https://fly.io/docs/hands-on/install-flyctl/) and run `fly auth login`.
2. In your project folder run:
   ```bash
   fly launch
   ```
   Choose app name, region; say no to PostgreSQL (you use MongoDB).
3. Set secrets:
   ```bash
   fly secrets set MONGODB_URI="mongodb+srv://..."
   ```
4. Deploy:
   ```bash
   fly deploy
   ```

---

## 4. Seed data after deploy

Your DB is empty until you seed it. Options:

**A. Run seed script locally** (pointing at Atlas):

```env
# .env
MONGODB_URI=mongodb+srv://...your-atlas-uri...
```

```bash
node src/script/seedDB.js
```

**B. Or** add a one-time seed step in your deploy (e.g. a script that runs after `npm install` on first deploy), if your hosting supports it.

---

## 5. Quick checklist

| Step | Done |
|------|------|
| Code on GitHub (no `.env` or `node_modules`) | |
| MongoDB Atlas cluster + user + connection string | |
| Network Access: Allow from anywhere (or add Render/Railway IPs) | |
| Hosting: Render / Railway / Fly.io | |
| Env var `MONGODB_URI` set on hosting | |
| Seed DB (run `seedDB.js` or your seed script once) | |

---

## 6. Test the deployed API

```bash
# Search
curl "https://YOUR-APP-URL/api/v1/search/product?query=iphone"

# Get metadata (use a real product ID from your DB)
curl "https://YOUR-APP-URL/api/v1/product/meta-data?productId=YOUR_PRODUCT_ID"
```

Once this works, you can use the same base URL in Postman or any frontend.
