# SPT Smart Part Traders — Automatic Email Orders

This package contains the SPT website plus a small Node.js backend that sends every placed order to:

**Shahzadhaseeb626@gmail.com**

## Important
The ZIP is **prepared for automatic email orders**, but email sending will only work after the backend is hosted and SMTP credentials are configured. Do not put SMTP passwords/API secrets into `index.html`.

## Setup
1. Install Node.js 18+ on the hosting/server.
2. Copy `.env.example` to `.env`.
3. Fill in the SMTP values supplied by your email provider.
4. Run `npm install`.
5. Run `npm start`.
6. Open the site from the same server URL (for example `https://your-domain.com`).

The website sends checkout data to `POST /api/order`; the server emails it to `ORDER_EMAIL`.

## Local test
After configuring `.env`, run:

`npm install`

`npm start`

Then open `http://localhost:3000`.

## Hosting
Because the current website is static, it needs a hosting provider that can run Node.js (or a serverless function equivalent) for the `/api/order` endpoint. A static-only host cannot perform the email send by itself.

## Security
SMTP credentials remain server-side. Before accepting real orders, also enable HTTPS and consider adding rate limiting/authentication to the order endpoint.

## Combined version
This version keeps the existing SPT website features together: access code 6366, all panels marked in stock, cart/checkout, WhatsApp ordering links, admin demo, and email-order backend preparation. The supplied Sunlong panel photo is used on all panel cards and product details.
