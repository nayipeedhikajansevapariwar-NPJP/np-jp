# NPJP Website Project

## Overview
This is the official website for **Nayi Peedhi Ka Janseva Parivar (NPJP)** - a grassroots community service organization. The website is built for Vercel deployment with Supabase persistence.

## Current State
- **Status**: Development complete, ready for production deployment
- **Last Updated**: December 2024

## Project Architecture

### Frontend (public/)
- `index.html` - Single-page application with all sections
- `styles.css` - Dark theme with NPJP brand colors
- `script.js` - Form handling, API calls, and interactivity
- `logo.png` - Generated NPJP logo
- `pay-qr.png` - Payment QR code placeholder

### Backend (api/)
- `reviews.js` - Public reviews CRUD
- `contacts.js` - Contact form submissions (admin protected GET)
- `volunteers.js` - Volunteer registration (admin protected GET, CSV export)
- `create-order.js` - Razorpay payment integration

### Configuration
- `server.js` - Express server for local development
- `vercel.json` - Vercel deployment configuration
- `package.json` - Node.js dependencies

## Tech Stack
- **Frontend**: Plain HTML, CSS, JavaScript
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: Supabase (PostgreSQL)
- **Payments**: Razorpay (optional)

## Design System
- **Background**: #0D1117 (dark)
- **Text**: White (#FFFFFF)
- **Accent Colors**:
  - Yellow: #F4C542
  - Green: #3AAA63
  - Blue: #2D8CFF
  - Purple: #8A52FF
  - Orange: #F28C38
- **Fonts**: Inter (body), Rajdhani (headings)

## Environment Variables Required
```
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-anon-key>
ADMIN_KEY=<secure-admin-password>
RAZORPAY_KEY_ID=<optional>
RAZORPAY_KEY_SECRET=<optional>
```

## Social Links
- Instagram: https://www.instagram.com/npjp_2025
- WhatsApp: https://chat.whatsapp.com/EbbmygVu9ZOB13UBEGZIHc?mode=hqrt2

## Key Features
1. Hero section with CTAs
2. About section with mission/vision
3. Work showcase (4 service cards)
4. Photo gallery (8 images, responsive grid)
5. Founding members (5 member cards with colored rings)
6. Reviews system with star ratings
7. Volunteer registration form
8. Contact form
9. Donation section (QR, UPI, Bank, Razorpay)

## Deployment Notes
- Website runs on port 5000 for local development
- Vercel handles serverless functions automatically
- Supabase tables: reviews, contacts, volunteers
- See README.md for full deployment instructions
