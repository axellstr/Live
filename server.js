require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.static("public"));
app.use(express.json());
app.use(
  cors({
    origin: "https://www.mcqueensdetailing.eu",
  })
);


const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

const storeItems = new Map([
  [1, { priceInCents: 2999, name: "Premium Car Shampoo", description: "Gentle yet effective cleaning for all car surfaces", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://fusionskin.de/thumbnail/7e/7e/44/1691570119/GlossSet_neu_1920x1920.jpg", category: "Cleaning" }],
  [2, { priceInCents: 3999, name: "Microfiber Wash Mitt", description: "Ultra-soft mitt for scratch-free washing shine", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://fusionskin.de/thumbnail/7e/7e/44/1691570119/GlossSet_neu_1920x1920.jpg", category: "Cleaning" }],
  [3, { priceInCents: 5999, name: "Ceramic Coating Kit", description: "Long-lasting protection with a mirror-like shine", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://fusionskin.de/media/d7/67/d6/1676819113/img_1436.jpg", category: "Protection" }],
  [4, { priceInCents: 1999, name: "Wheel Cleaner Spray", description: "Dissolves brake dust and grime effortlessly", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://picsum.photos/200", category: "Cleaning" }],
  [5, { priceInCents: 4999, name: "Dual Action Polisher", description: "Professional-grade polisher for perfect finishes", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://picsum.photos/200", category: "Polishing" }],
  [6, { priceInCents: 1499, name: "Interior Detailing Brushes Set", description: "Reach every nook and cranny for a thorough clean", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://picsum.photos/200", category: "Tools" }],
  [7, { priceInCents: 3499, name: "Clay Bar Kit", description: "Remove contaminants for a smooth-as-glass feel", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://picsum.photos/200", category: "Cleaning" }],
  [8, { priceInCents: 2499, name: "Tire Shine Gel", description: "Long-lasting shine for your tires", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://picsum.photos/200", category: "Protection" }],
  [9, { priceInCents: 6999, name: "Professional Vacuum Cleaner", description: "Powerful suction for a spotless interior", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://picsum.photos/200", category: "Tools" }],
  [10, { priceInCents: 1999, name: "Glass Cleaner Spray", description: "Streak-free shine for all your car windows", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://picsum.photos/200", category: "Cleaning" }],
  [11, { priceInCents: 4499, name: "Leather Cleaner", description: "Nourish and protect your leather interior", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://picsum.photos/200", category: "Cleaning" }],
  [12, { priceInCents: 3999, name: "Foam Cannon", description: "Create thick, clinging foam for effective cleaning", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://picsum.photos/200", category: "Tools" }],
  [13, { priceInCents: 2999, name: "Detailing Spray", description: "Quick touch-ups between washes", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://picsum.photos/200", category: "Cleaning" }],
  [14, { priceInCents: 5999, name: "Paint Correction Kit", description: "Remove swirls and scratches like a pro", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://picsum.photos/200", category: "Polishing" }],
  [15, { priceInCents: 1499, name: "Microfiber Towels Pack", description: "Ultra-soft, lint-free towels for every detailing task", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://picsum.photos/200", category: "Accessories" }],
  [16, { priceInCents: 3999, name: "Pressure Washer", description: "Efficient cleaning power for faster washes", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://picsum.photos/200", category: "Tools" }],
  [17, { priceInCents: 2499, name: "Trim Restorer", description: "Bring faded plastic and rubber back to life", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://picsum.photos/200", category: "Protection" }],
  [18, { priceInCents: 7999, name: "Car Lift", description: "Elevate your detailing game, literally", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://picsum.photos/200", category: "Tools" }],
  [19, { priceInCents: 1999, name: "Detailing Apron", description: "Keep yourself clean while you clean", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://picsum.photos/200", category: "Accessories" }],
  [20, { priceInCents: 4999, name: "Professional Detailing Kit", description: "Everything you need to start your detailing business", imageUrl: "/assets/images/about/me.jpg", stripeImageUrl: "https://picsum.photos/200", category: "Accessories" }]
]);

app.post("/api/create-checkout-session", async (req, res) => {
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


// Endpoint to get the items
app.get('/store-items', (req, res) => {
  const itemsArray = Array.from(storeItems, ([id, details]) => ({ id, ...details }));
  res.json(itemsArray);
});

app.listen(3000, () => console.log("Server is running on port 3000"))
