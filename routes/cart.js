// const express = require("express");
// const fs = require("fs");
// const router = express.Router();

// const readCart = () => JSON.parse(fs.readFileSync("data/cart.json"));
// const writeCart = (data) =>
//   fs.writeFileSync("data/cart.json", JSON.stringify(data, null, 2));

// router.get("/", (req, res) => {
//   const cart = readCart();
//   res.json(cart);
// });

// router.get("/:id", (req, res) => {
//   const cart = readCart();
//   const item = cart.find((c) => c.id === parseInt(req.params.id));

//   if (item) {
//     res.json(item);
//   } else {
//     res.status(404).json({ error: "Cart item not found" });
//   }
// });
// router.post("/", (req, res) => {
//   const cart = readCart();
//   const { name, price } = req.body;
//   const existingItem = cart.find((item) => item.name === name);

//   if (existingItem) {
//     existingItem.qty += 1;
//     writeCart(cart);

//     return res.status(200).json({
//       message: "Item quantity updated",
//       item: existingItem
//     });
//   }
//   const newItem = {
//     id: cart.length ? cart[cart.length - 1].id + 1 : 1,
//     name,
//     price,
//     qty: 1
//   };

//   cart.push(newItem);
//   writeCart(cart);

//   res.status(201).json({
//     message: "Item added to cart",
//     item: newItem
//   });
// });

// router.put("/:id", (req, res) => {
//   let cart = readCart();
//   const id = parseInt(req.params.id);
//   const newQty = req.body.qty;

//   let itemFound = false;

//   cart = cart.map((item) => {
//     if (item.id === id) {
//       itemFound = true;
//       return { ...item, qty: newQty };
//     }
//     return item;
//   });

//   if (!itemFound) {
//     return res.status(404).json({ error: "Cart item not found" });
//   }

//   writeCart(cart);
//   res.json({ message: "Cart item updated" });
// });

// router.delete("/:id", (req, res) => {
//   const cart = readCart();
//   const updatedCart = cart.filter((c) => c.id !== parseInt(req.params.id));

//   writeCart(updatedCart);
//   res.json({ message: "Item removed from cart" });
// });

// module.exports = router;

const express = require("express");
const auth = require("../middlewares/authMiddleware");
const {getCart,addToCart,updateQuantity,removeItem} = require("../controllers/cartController");
const router = express.Router();

router.get("/", auth, getCart);
router.post("/", auth, addToCart);
router.put("/:id", auth, updateQuantity);
router.delete("/:id", auth, removeItem);

module.exports = router;