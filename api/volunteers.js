// api/volunteers.js
const express = require('express');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { nanoid } = require('nanoid');

const router = express.Router();
const dbPath = path.join(__dirname, '..', 'db.json');
const adapter = new FileSync(dbPath);
const db = low(adapter);
db.defaults({ reviews: [], contacts: [], volunteers: [] }).write();

// POST /api/volunteers
router.post('/', (req, res) => {
  try {
    const { name, email, phone, city = '', skills = '', availability = '', consent } = req.body || {};
    if (!name || !email || !phone || consent !== true) {
      return res.status(400).json({ error: 'name, email, phone and consent=true are required' });
    }
    const entry = {
      id: nanoid(),
      name,
      email,
      phone,
      city,
      skills,
      availability,
      consent: true,
      date: new Date().toISOString()
    };
    db.get('volunteers').push(entry).write();
    res.json(entry);
  } catch (err) {
    console.error('POST /api/volunteers error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/volunteers (admin only)
router.get('/', (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const list = db.get('volunteers').sortBy('date').reverse().value();
    res.json(list);
  } catch (err) {
    console.error('GET /api/volunteers error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
