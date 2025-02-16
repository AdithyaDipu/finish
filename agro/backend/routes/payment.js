const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const Crop = require('../models/crops');
const User = require('../models/users');

require('dotenv').config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Create Stripe Checkout Session
router.post('/create-checkout-session', async (req, res) => {
  const { cropId, quantity, buyerEmail } = req.body;

  try {
    const crop = await Crop.findById(cropId).populate('farmer');
    if (!crop) return res.status(404).json({ error: 'Crop not found' });

    // ✅ Calculate total price
    const totalAmount = crop.price * quantity;

    // ✅ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: buyerEmail,
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: crop.name,
              description: `Crop from ${crop.farmer.firstName} ${crop.farmer.lastName}`,
            },
            unit_amount: crop.price * 100, // Stripe uses paise
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/checkout-cancel`,
      metadata: {
        cropId: crop._id.toString(),
        farmerId: crop.farmer._id.toString(),
        totalAmount: totalAmount,
      },
    });

    res.json({ id: session.id });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ Stripe Webhook to handle successful payments
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const cropId = session.metadata.cropId;
    const farmerId = session.metadata.farmerId;

    // ✅ Mark crop as paid
    await Crop.findByIdAndUpdate(cropId, { isPaid: true });

    // ✅ Transfer funds to farmer
    const transfer = await stripe.transfers.create({
      amount: session.amount_total,
      currency: 'inr',
      destination: farmerId, // Farmer's Stripe account
    });

    console.log(`Payment successful & funds transferred to Farmer: ${farmerId}`);
  }

  res.status(200).json({ received: true });
});

module.exports = router;
