# Deploy AACSD E-ID on Hostinger (Managed Node)

**Domain:** `AACSD.techzoid.ng`  
**Plan:** Business Web Hosting (existing Techzoid account)

## Why MySQL

Hostinger Node redeploys overwrite `hbuilds/`. SQLite files and `public/uploads` do not survive. Production uses **MySQL** + photos in DB (`/api/photo/[token]`).

## Steps

1. Log in to [hPanel](https://hpanel.hostinger.com/)
2. **Databases → MySQL** → create DB + user (note name/user/password)
3. **Websites → Add Website → Node.js web app**
4. Domain: `AACSD.techzoid.ng` (or add subdomain under `techzoid.ng`)
5. Import GitHub repo **or** upload project zip (exclude `node_modules`, `.next`, `.env`, `prisma/*.db`)
6. Settings: framework Next.js, Node 20+, build `npm run build`, output `.next`
7. Environment variables:

```
DATABASE_URL=mysql://USER:PASSWORD@127.0.0.1:3306/DB_NAME
SESSION_SECRET=<32+ random chars>
APP_URL=https://AACSD.techzoid.ng
ADMIN_EMAIL=<admin email>
ADMIN_PASSWORD=<strong password>
SETUP_SECRET=<32+ random chars>
```

8. Deploy
9. Bootstrap admin once:

```bash
curl -X POST https://AACSD.techzoid.ng/api/setup -H "x-setup-secret: $SETUP_SECRET"
```

10. Open `/admin/login`, then change password when convenient
11. Smoke: `/api/health`, create one ID, `/v/{token}`

## DNS

If Hostinger hosts `techzoid.ng` DNS, adding the website usually creates the subdomain record. Otherwise add A/CNAME for `AACSD` to Hostinger.
