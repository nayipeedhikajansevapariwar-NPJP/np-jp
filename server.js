const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

const reviewsHandler = require('./api/reviews');
const contactsHandler = require('./api/contacts');
const volunteersHandler = require('./api/volunteers');
const createOrderHandler = require('./api/create-order');

app.all('/api/reviews', (req, res) => reviewsHandler(req, res));
app.all('/api/contacts', (req, res) => contactsHandler(req, res));
app.all('/api/volunteers', (req, res) => volunteersHandler(req, res));
app.all('/api/create-order', (req, res) => createOrderHandler(req, res));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`NPJP Server running at http://0.0.0.0:${PORT}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Supabase configured:', !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY));
    console.log('Razorpay configured:', !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET));
});
