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





// Endpoint to get the items
app.get('/store-items', (req, res) => {
  const itemsArray = Array.from(storeItems, ([id, details]) => ({ id, ...details }));
  res.json(itemsArray);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
