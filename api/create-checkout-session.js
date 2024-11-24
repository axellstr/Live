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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchStoreItems().then(items => {
        if (items) {
            displayStoreItems(items);
        }
    });

    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.addEventListener("click", () => {
        const itemsArray = Object.values(basket).map(item => ({
            id: item.id,
            quantity: item.quantity
        }));

        fetch("https://www.mcqueensdetailing.eu/api/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ items: itemsArray }),
        })
        .then(res => {
            if (res.ok) return res.json()
            return res.json().then(json => Promise.reject(json))
        })
        .then(({ url }) => {
            window.location = url
        })
        .catch(e => {
            console.error(e.error)
            alert("Error: " + e.error);
        });
    });

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
