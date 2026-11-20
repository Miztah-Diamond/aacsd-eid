# Task log

## TASK-20261120-AACSD-HOSTINGER-DEPLOY
**Status:** DONE WITH CAVEATS
**Done:**
- Committed/pushed aacsd-eid to GitHub (194ea10 MVP, 383ba06 engines.node 20.x)
- Made repo public for Hostinger public URL path
- Created aacsd.techzoid.ng site stub on Hostinger
- Hostinger Agent prepared Node.js zip deploy to aacsd.techzoid.ng
**Blocked:**
- Hostinger Agent Confirm action hangs/disabled; MySQL/env/setup/smoke not run yet
**Next human step:** In Chrome Hostinger Agent, click Confirm on Node zip deploy (or Connect GitHub once), then create MySQL and set env per docs/DEPLOY-HOSTINGER.md

---

## [2026-11-20 21:57 UTC] Task: AACSD Hostinger MySQL migrate + setup + smoke

**ID:** TASK-20261120-AACSD-MIGRATE-SETUP-SMOKE
**Request:** Finish Hostinger deploy autonomously (MySQL, env, setup, smoke)
**Roles:** fullstack-engineer, devops-engineer, debugging-engineer, technical-documentation-engineer
**Status:** completed-with-caveats

### Summary
Remote MySQL IP allowlist enabled via Hostinger Agent for operator IP. Applied Prisma migration `20261120170000_init_mysql` against srv2123.hstgr.io. POST /api/setup created admin. Smoke: health 200, admin login, member AACSD-SMOKE-001, /v/{token} ACTIVE, /id/{token} card with QR+Code128, photo API 200, login page has no demo credentials.

### Changes
- Applied migration on production MySQL (no app code change required for migrate)
- `.gitignore`: ignore `.env.hostinger*` and `.env.migrate.tmp`
- `scripts/smoke-create-member.mjs`: one-off Prisma smoke member helper (remote DB)
- `.devco/memory` bootstrap + session appends

### Verification
- `prisma migrate deploy` ? All migrations successfully applied
- POST /api/setup ? 200 Admin created
- Admin login ? /admin Members list
- /v/lheVW2yfspjxzLF2dYTlq ? ACTIVE
- /id/lheVW2yfspjxzLF2dYTlq ? card face OK; org contact footer only
- /api/health 200; /api/photo/{token} 200

### Caveats
- Hostinger Redeploy / phpMyAdmin / +Allow IP UI clicks often miss under computer-use; Agent chat Allow IP path worked
- External connections UI may still show empty after Agent enable; migrate still succeeded
- Smoke member created via Prisma script (browser file upload unavailable in ide-browser); UI create form not exercised with photo
- Live app remains redeploy3.zip Current; start script will run migrate on future restarts (already applied)

### Self-critique
**Verdict:** DONE WITH CAVEATS

## [2026-11-20 22:09 UTC] Task: Point single admin at official Gmail

**ID:** TASK-20261120-AACSD-ADMIN-GMAIL
**Request:** Create admin account with official Gmail
**Status:** completed
### Summary
One-admin lock: updated existing AdminUser email to chsalumniunizik@gmail.com (kept password hash). Local secrets ADMIN_EMAIL aligned. Hostinger panel ADMIN_EMAIL env still may say old address until next env edit (setup only).

---

## [2026-11-20 22:11 UTC] Task: Add second admin (official Gmail) — user override

**ID:** TASK-20261120-AACSD-TWO-ADMINS
**Request:** Create NEW admin chsalumniunizik@gmail.com; restore admin@aacsd.techzoid.ng (do not leave only Gmail)
**Status:** completed-with-caveats
**Roles:** fullstack-engineer, technical-documentation-engineer

### Summary
Restored primary AdminUser email to admin@aacsd.techzoid.ng (same row/password). Created second AdminUser for chsalumniunizik@gmail.com with a new password. Both bcrypt-verified. Secrets: ADMIN_EMAIL remains bootstrap primary; ADMIN_EMAIL_GMAIL + ADMIN_PASSWORD_GMAIL added.

### Caveat / product lock
Original product lock was one admin only. User explicitly overrode: two admins now exist in production MySQL. Setup route still refuses creating a third via /api/setup when count >= 1.

### Verification
- admins: admin@aacsd.techzoid.ng + chsalumniunizik@gmail.com
- primary_login_ok / gmail_login_ok

## [2026-11-20 23:34 UTC] Task: Slogan + remove Department UI + redeploy

**ID:** TASK-20261120-AACSD-SLOGAN-DEPT
**Request:** Slogan Connecting minds, building future; commit/deploy; include Department field removal
**Status:** in-progress (commit then Hostinger redeploy)
**Changes:**
- ORG.motto / mottoUpper -> Connecting minds, building future
- Removed Department from create form, card, verify, admin detail (DB default kept)
