// api/contacts.js
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

// POST /api/contacts
router.post('/', (req, res) => {
  try {
    const { name, email, location = '', message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, and message are required' });
    }
    const entry = { id: nanoid(), name, email, location, message, date: new Date().toISOString() };
    db.get('contacts').push(entry).write();
    res.json(entry);
  } catch (err) {
    console.error('POST /api/contacts error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/contacts (admin only)
router.get('/', (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const list = db.get('contacts').sortBy('date').reverse().value();
    res.json(list);
  } catch (err) {
    console.error('GET /api/contacts error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
