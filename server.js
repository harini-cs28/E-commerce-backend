require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();

const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const authRouter = require("./routes/auth");
const User = require("./models/User");
const auth = require("./middlewares/authMiddleware");
app.use(express.json());     
app.use(cors());             
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
connectDB();
app.use("/products", productRouter);   
app.use("/cart", cartRouter);     
app.use("/auth",authRouter);    
app.use("/orders", require("./routes/order"));

app.get("/profile", auth, (req, res) => {
  res.json({
    message: "Profile",
    userData: req.userData,
  });
});

app.get("/", (req, res) => {
  res.json({ message: "E-commerce API Running" });
});

// app.listen(4000, () => {
//   console.log("Server running on http://localhost:4000");
// });
app.listen(process.env.PORT,() => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});

