require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const authRouter = require("./routes/auth");

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

connectDB();

/* ROUTES */

app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/auth", authRouter);
app.use("/orders", require("./routes/order"));
app.use("/profile", require("./routes/profile"));

/* HOME */

app.get("/", (req, res) => {
  res.json({ message: "E-commerce API Running" });
});

/* SERVER */

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});