// api/reviews.js
const express = require('express');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { nanoid } = require('nanoid');

const router = express.Router();

// db.json in repo root
const dbPath = path.join(__dirname, '..', 'db.json');
const adapter = new FileSync(dbPath);
const db = low(adapter);
db.defaults({ reviews: [], contacts: [], volunteers: [] }).write();

// GET /api/reviews -> newest first
router.get('/', (req, res) => {
  try {
    const reviews = db.get('reviews').sortBy('date').reverse().value();
    res.json(reviews);
  } catch (err) {
    console.error('GET /api/reviews error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/reviews -> { name, text, rating }
router.post('/', (req, res) => {
  try {
    const { name = 'Anonymous', text, rating = 5 } = req.body || {};
    if (!text || String(text).trim() === '') {
      return res.status(400).json({ error: 'text is required' });
    }
    const entry = {
      id: nanoid(),
      name,
      text,
      rating: Number(rating) || 5,
      date: new Date().toISOString()
    };
    db.get('reviews').push(entry).write();
    res.json(entry);
  } catch (err) {
    console.error('POST /api/reviews error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
