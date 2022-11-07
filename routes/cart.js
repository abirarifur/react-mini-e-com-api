const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("./verifyToken");

const router = require("express").Router();

router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted...");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    // console.log(req.params.id);
    // const { password, ...rest } = user._doc;
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();

    // console.log(req.params.id);
    // const { password, ...rest } = user._doc;
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});

// router.get("/", async (req, res) => {
//   const qNew = req.query.new;
//   const qCategory = req.query.category;

//   try {
//     let products;

//     if (qNew) {
//       products = await Product.find().sort({ createAt: -1 }).limit(1);
//     } else if (qCategory) {
//       products = await Product.find({
//         categories: {
//           $in: [qCategory],
//         },
//       });
//     } else {
//       products = await Product.find();
//     }

//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

module.exports = router;
