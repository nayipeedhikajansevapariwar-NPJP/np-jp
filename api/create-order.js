// api/create-order.js
const RazorpayLib = require('razorpay'); // require but only use if keys present

module.exports = async function (req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { amount } = req.body || {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid amount (in rupees) is required' });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return res.status(501).json({ error: 'Razorpay not configured' });
    }

    try {
      const Razorpay = new RazorpayLib({ key_id, key_secret });
      const order = await Razorpay.orders.create({
        amount: Math.round(Number(amount) * 100),
        currency: 'INR',
        receipt: 'npjp_rcpt_' + Date.now(),
        payment_capture: 1
      });
      return res.json(order);
    } catch (rpErr) {
      console.error('Razorpay create order error', rpErr);
      return res.status(500).json({ error: 'Razorpay error', details: rpErr.message || rpErr });
    }
  } catch (err) {
    console.error('api/create-order error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
