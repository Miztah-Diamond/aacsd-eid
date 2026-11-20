# AACSD Membership E-ID

Digital membership IDs for **Alumni Association of Chinese Studies Department Unizik**.

Production host: `https://AACSD.techzoid.ng`  
Stack: see `tech-stack.md`

## Local setup

```bash
cp .env.example .env
# set SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, APP_URL
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

- Admin: `/admin/login` (no credentials shown on the page)
- Card: `/id/{token}`
- Verify: `/v/{token}`
- Health: `/api/health`

## Hostinger (Managed Node)

1. Point `AACSD.techzoid.ng` A/CNAME to Hostinger
2. Deploy this Node app; set env vars from `.env.example`
3. Ensure `DATABASE_URL` file path is writable (e.g. `file:./data/aacsd.db`)
4. Run migrate + seed once on the server
5. Change the admin password after first login

## Spec

Canonical product docs: `../docs/eid-membership-research/`
