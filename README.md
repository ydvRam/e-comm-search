# E-commerce Search API

Node.js + Express API for product search and metadata. Uses MongoDB.

## Prerequisites

- Node.js
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

## Setup

```bash
npm install
```

Optional: create `.env` in the project root:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce-search
```

If you omit these, the app uses port 3000 and the default local MongoDB URL above.

## Run

```bash
npm start
```

Server runs at `http://localhost:3000`.

## API

Base URL: `http://localhost:3000/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/search/product?query=...` | Search products (supports typos) |
| POST | `/product` | Create product |
| GET | `/product/meta-data?productId=...` | Get product metadata |
| PUT | `/product/meta-data` | Update metadata (body: `{ "productId", "metadata" }`) |

## Seed data

```bash
node src/script/seedDB.js
```
