# Nayi Peedhi Ka Janseva Parivar (NPJP)

A modern community service organization website built with plain HTML/CSS/JS, Vercel serverless functions, and Supabase for persistence.

## Features

- **Modern Dark Theme**: Beautiful UI with NPJP brand colors
- **Hinglish Content**: Mix of Hindi and English for local audience
- **Responsive Design**: Mobile-first, works on all devices
- **Reviews System**: Public can submit and view reviews
- **Volunteer Registration**: Join the NPJP team
- **Contact Form**: Get in touch with the organization
- **Donation Support**: UPI, Bank Transfer, and Razorpay integration
- **Admin APIs**: Protected endpoints for data access

## Tech Stack

- **Frontend**: Plain HTML, CSS, JavaScript
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: Supabase (PostgreSQL)
- **Payments**: Razorpay (optional)
- **Hosting**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd npjp-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Supabase (required for production)
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   
   # Admin access
   ADMIN_KEY=your-secure-admin-key
   
   # Razorpay (optional)
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=your-secret
   
   # Social links
   INSTAGRAM_LINK=https://www.instagram.com/npjp_2025
   WHATSAPP_INVITE_LINK=https://chat.whatsapp.com/EbbmygVu9ZOB13UBEGZIHc?mode=hqrt2
   ```

4. **Run the development server**
   ```bash
   npm start
   ```
   
   Visit `http://localhost:5000`

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Note your project URL and anon key from Settings > API

### 2. Create Database Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Reviews table
CREATE TABLE reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) DEFAULT 'Anonymous',
    text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reviews
CREATE POLICY "Anyone can read reviews" ON reviews
    FOR SELECT USING (true);

-- Allow anyone to insert reviews
CREATE POLICY "Anyone can insert reviews" ON reviews
    FOR INSERT WITH CHECK (true);

-- Contacts table
CREATE TABLE contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contacts (admin reads via service key)
CREATE POLICY "Anyone can insert contacts" ON contacts
    FOR INSERT WITH CHECK (true);

-- Volunteers table
CREATE TABLE volunteers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    city VARCHAR(255),
    skills TEXT,
    availability VARCHAR(100),
    consent BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert volunteers
CREATE POLICY "Anyone can insert volunteers" ON volunteers
    FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX idx_volunteers_created_at ON volunteers(created_at DESC);
CREATE INDEX idx_volunteers_email ON volunteers(email);
```

## Vercel Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect the configuration from `vercel.json`

### 3. Set Environment Variables

In Vercel Dashboard > Project > Settings > Environment Variables:

| Variable | Value | Required |
|----------|-------|----------|
| SUPABASE_URL | Your Supabase project URL | Yes |
| SUPABASE_ANON_KEY | Your Supabase anon key | Yes |
| ADMIN_KEY | Secure admin password | Yes |
| RAZORPAY_KEY_ID | Razorpay Key ID | No |
| RAZORPAY_KEY_SECRET | Razorpay Secret | No |

### 4. Deploy

Click "Deploy" and your site will be live!

## API Endpoints

### Public Endpoints

#### GET /api/reviews
Returns all reviews (newest first).

```bash
curl https://your-site.vercel.app/api/reviews
```

#### POST /api/reviews
Submit a new review.

```bash
curl -X POST https://your-site.vercel.app/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "text": "Great work!", "rating": 5}'
```

#### POST /api/contacts
Submit a contact message.

```bash
curl -X POST https://your-site.vercel.app/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "test@example.com", "message": "Hello!"}'
```

#### POST /api/volunteers
Register as a volunteer.

```bash
curl -X POST https://your-site.vercel.app/api/volunteers \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "test@example.com", "phone": "9876543210", "consent": true}'
```

#### POST /api/create-order
Create a Razorpay payment order.

```bash
curl -X POST https://your-site.vercel.app/api/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 500}'
```

### Admin Endpoints (Protected)

These endpoints require the `x-admin-key` header.

#### GET /api/contacts
Get all contact submissions.

```bash
curl https://your-site.vercel.app/api/contacts \
  -H "x-admin-key: your-admin-key"
```

#### GET /api/volunteers
Get all volunteer registrations.

```bash
curl https://your-site.vercel.app/api/volunteers \
  -H "x-admin-key: your-admin-key"
```

#### GET /api/volunteers?format=csv
Export volunteers as CSV.

```bash
curl https://your-site.vercel.app/api/volunteers?format=csv \
  -H "x-admin-key: your-admin-key" \
  -o volunteers.csv
```

## Project Structure

```
npjp-website/
├── public/
│   ├── index.html      # Main HTML page
│   ├── styles.css      # All styles
│   ├── script.js       # Frontend JavaScript
│   ├── logo.png        # NPJP logo
│   └── pay-qr.png      # Payment QR code
├── api/
│   ├── reviews.js      # Reviews API
│   ├── contacts.js     # Contacts API
│   ├── volunteers.js   # Volunteers API
│   └── create-order.js # Payment API
├── server.js           # Local dev server
├── package.json
├── vercel.json         # Vercel configuration
└── README.md
```

## Security Features

- **Rate Limiting**: All endpoints have in-memory rate limiting
- **Input Sanitization**: All user inputs are sanitized
- **Admin Protection**: Admin routes require x-admin-key header
- **CORS**: Proper CORS headers for API access
- **RLS**: Supabase Row Level Security enabled

## Social Links

- **Instagram**: https://www.instagram.com/npjp_2025
- **WhatsApp Group**: https://chat.whatsapp.com/EbbmygVu9ZOB13UBEGZIHc?mode=hqrt2

## License

MIT License - Feel free to use for community service projects.

## Support

For any issues, contact NPJP through the website contact form or social media.

---

**Nayi Peedhi Ka Janseva Parivar (NPJP)**  
*Ground level sach ko saamne lana — Bringing real issues to light.*
