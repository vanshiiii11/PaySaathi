# PaySaathi 🤝💸

> **P2P cash ↔ UPI exchange matchmaking.** Connect with people nearby who want to swap physical cash for digital (UPI) payment, or vice versa.

PaySaathi is a **local matchmaking and communication layer only** — it helps two nearby users discover each other, agree on an exchange, chat, and rate each other afterward. **The app itself does not move money, hold balances, or process any payment.** The actual cash handover and UPI transfer happen directly between users, in person, outside the app.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Mobile App | Expo SDK 51 (React Native, TypeScript) |
| Navigation | expo-router (file-based) |
| State | Zustand + TanStack Query |
| Styling | NativeWind v4 (Tailwind for RN) |
| Maps | react-native-maps |
| Real-time | Socket.io client |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL (Supabase recommended — has PostGIS built-in) |
| ORM | Prisma (with `$queryRaw` for PostGIS radius queries) |
| Real-time server | Socket.io + Redis adapter |
| Auth | JWT (15 min access / 7 day refresh) + OTP (MSG91/Twilio) |
| Push notifications | Expo Push Notification Service |
| File storage | Cloudinary (avatar photos) |

---

## Prerequisites

- Node.js ≥ 20
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- PostgreSQL with PostGIS extension (or a Supabase project — PostGIS is pre-installed)
- Redis (local: `brew install redis && brew services start redis`)
- Expo Go app on your phone OR iOS Simulator / Android Emulator

---

## Project Structure

```
paysaathi/
├── app/                        # Expo React Native app
│   ├── app/                    # expo-router screen files
│   │   ├── (auth)/             # Onboarding + auth screens
│   │   ├── (tabs)/             # Main tab screens (Home, Exchanges, Chat, Profile)
│   │   ├── chat/[threadId].tsx
│   │   ├── exchange-request/[userId].tsx
│   │   ├── rating/[exchangeId].tsx
│   │   ├── report/[userId].tsx
│   │   └── profile/[userId].tsx
│   └── src/
│       ├── components/ui/      # Button, Card, Input, Avatar, Chip, RatingStars, etc.
│       ├── components/user/    # UserCard, UserPin (map marker)
│       ├── components/exchange/# ExchangeCard, IncomingRequestCard
│       ├── components/chat/    # MessageBubble, QuickReplies
│       ├── hooks/              # useAuth, useLocation, useNearbyUsers, useChat, useExchange
│       ├── services/           # api.ts (Axios + interceptors), socket.ts
│       ├── store/              # Zustand stores (auth, exchange, chat)
│       ├── theme/              # colors.ts, typography.ts, spacing.ts
│       └── types/              # Shared TypeScript interfaces
│
└── server/                     # Node.js + Express backend
    ├── prisma/schema.prisma    # Full database schema
    └── src/
        ├── controllers/        # Route handlers (auth, user, match, exchange, chat, rating, report)
        ├── services/           # Business logic (matching PostGIS, exchange, OTP, push, JWT)
        ├── middleware/         # auth guard, rate limiters, zod validation
        ├── routes/             # Express routers
        ├── sockets/            # Socket.io server + event handlers
        ├── lib/                # Prisma singleton, Redis client
        └── utils/              # response helpers, phone validation
```

---

## Setup — Backend (server/)

### 1. Install dependencies
```bash
cd server
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
```

Key variables to fill in:

| Variable | How to get it |
|---|---|
| `DATABASE_URL` | Supabase: Project Settings → Database → Connection string |
| `JWT_ACCESS_SECRET` | Run: `openssl rand -hex 32` |
| `JWT_REFRESH_SECRET` | Run: `openssl rand -hex 32` (different value) |
| `MSG91_AUTH_KEY` | From msg91.com dashboard |
| `MSG91_TEMPLATE_ID` | OTP SMS template ID from MSG91 |
| `REDIS_URL` | Local: `redis://localhost:6379` |
| `CLOUDINARY_CLOUD_NAME` | From cloudinary.com dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EXPO_ACCESS_TOKEN` | expo.dev → Account Settings → Access Tokens |

> **Development shortcut**: In `NODE_ENV=development`, OTPs are printed to the server console — no MSG91 key needed for local testing.

### 3. Set up the database
```bash
npm run prisma:generate   # generate Prisma client
npm run prisma:migrate    # run migrations (creates all tables)
```

> If using Supabase: enable PostGIS via Dashboard → Database → Extensions → postgis → Enable.

### 4. Start the dev server
```bash
npm run dev
```

Server runs on http://localhost:3000. Health check: `GET /health`

---

## Setup — App (app/)

### 1. Install dependencies
```bash
cd app
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
```

| Variable | Value |
|---|---|
| `EXPO_PUBLIC_API_URL` | Use your LAN IP when testing on device: `http://192.168.x.x:3000/api/v1` |
| `EXPO_PUBLIC_SOCKET_URL` | Same host without `/api/v1`: `http://192.168.x.x:3000` |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key (Android only) — enable Maps SDK for Android in Google Cloud Console |

### 3. Start the Expo dev server
```bash
npm start
```

Scan the QR with Expo Go, or press `i` (iOS Simulator) / `a` (Android Emulator).

---

## API Reference (Base: /api/v1)

### Auth
```
POST /auth/otp/send        { phone }            → sends OTP (rate limited: 3/10min)
POST /auth/otp/verify      { phone, code }      → { user, accessToken, refreshToken, isNewUser }
POST /auth/refresh         { refreshToken }     → { accessToken }
POST /auth/logout          { refreshToken }     → 200 OK
```

### Users
```
GET    /users/me                    → own profile
PATCH  /users/me                    → { name?, bio? }
POST   /users/me/avatar             → multipart avatar upload
PATCH  /users/me/status             → { isActive, intent?, minAmount?, maxAmount?, radiusKm?, locationLat?, locationLng? }
GET    /users/:id                   → public profile
```

### Matching
```
GET /match/nearby?lat=&lng=&radiusKm=&direction=   → NearbyUser[] (fuzzed ±100m coords)
```

### Exchanges
```
POST   /exchanges                   → create exchange request (auto-expires in 5 min)
PATCH  /exchanges/:id               → { status: ACCEPTED|DECLINED|CANCELLED|COMPLETED }
GET    /exchanges?page=&limit=      → paginated exchange history
GET    /exchanges/:id               → single exchange detail
```

### Chat
```
GET /chats/:threadId/messages?page=&limit=   → paginated message history
```

### Ratings & Safety
```
POST   /ratings                     → { exchangeId, rateeId, stars, tags?, comment? }
GET    /ratings/users/:id           → user's received ratings
POST   /reports                     → { reportedId, reason, details?, exchangeId? }
POST   /reports/users/:id/block     → block a user
DELETE /reports/users/:id/block     → unblock a user
```

---

## Socket.io Events

Connect with: `socket({ auth: { token: "<JWT accessToken>" } })`

| Event | Dir | Description |
|---|---|---|
| `join_thread` | C→S | `{ threadId }` — join chat room |
| `send_message` | C→S | `{ threadId, content, type? }` — persist + broadcast |
| `typing_start` | C→S | `{ threadId }` — broadcast typing indicator |
| `typing_stop` | C→S | `{ threadId }` — stop typing indicator |
| `new_message` | S→C | Full Message object broadcast to thread room |
| `new_message_notification` | S→C | Notifies partner's personal room |
| `typing_start` / `typing_stop` | S→C | `{ threadId, userId }` broadcast |

---

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| Primary | `#0F9D74` | CTAs, active states, links |
| Accent | `#FF6B4A` | Secondary CTAs, highlights |
| Background | `#FAFAFA` | App background |
| Surface | `#FFFFFF` | Cards, sheets |
| Text | `#1A1A1A` | Primary text |
| Text secondary | `#6B7280` | Labels, hints |
| Cash pin | `#22C55E` | "Has cash, wants UPI" map pins |
| UPI pin | `#6366F1` | "Has UPI, wants cash" map pins |

---

## Privacy & Safety Decisions

- **Location fuzzing**: Coordinates are jittered ±~100m before sending to other users. Exact GPS never exposed.
- **OTP rate limiting**: Max 3 OTPs per phone per 10 minutes.
- **Auto-suspend**: Users with ≥5 reports are auto-suspended pending review.
- **No payment data**: App never stores UPI IDs, bank details, or any financial credentials.
- **JWT in Keychain**: Tokens stored in `expo-secure-store` (device keychain), not AsyncStorage.
- **Exchange expiry**: Pending requests auto-expire after 5 minutes.

---

## Deployment

### Backend (Render / Railway)
1. Point to `server/` directory
2. Build: `npm install && npm run build`
3. Start: `node dist/index.js`
4. Add all env vars, PostgreSQL addon, Redis addon

### App (EAS Build)
```bash
npm install -g eas-cli
eas build --platform all
```

---

## License

MIT
