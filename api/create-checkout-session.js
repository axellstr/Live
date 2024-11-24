app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item.id)
        return {
          price_data: {
            currency: "eur",
            product_data: {
              images: storeItem.stripeImageUrl ? [storeItem.stripeImageUrl] : [],
              name: storeItem.name,
              description: storeItem.description,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        }
      }),
      success_url: `${process.env.CLIENT_URL}/success.html`,
      cancel_url: `${process.env.CLIENT_URL}/eshop.html`,
      shipping_address_collection: {
        allowed_countries: ['GR','CY'] // Add more as needed
      },
      customer_email: req.body.email // Optional: Collect customer email
    })
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})
