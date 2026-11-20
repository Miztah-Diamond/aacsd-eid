# AACSD E-ID — Tech Stack

**Locked:** 2026-11-20 (updated for Hostinger deploy)

| Layer | Choice |
|-------|--------|
| App | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | Tailwind CSS 4 + DM Sans / Source Serif 4 |
| DB | **MySQL** via Prisma 5 (Hostinger Business; SQLite wiped on redeploy) |
| Photos | Stored in MySQL (`LONGBLOB`), served via `/api/photo/[token]` |
| Auth | Single admin, httpOnly JWT cookie (`jose` + `bcryptjs`) |
| Codes | `qrcode` (QR) + `bwip-js` (Code 128) |
| Hosting | Hostinger Business Managed Node → `AACSD.techzoid.ng` |

Do not add libraries outside this list without an ADR.
