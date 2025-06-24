import Order from '../models/orders.js';
import Product from '../models/products.js'; // הוסף את זה למעלה
import mongoose from 'mongoose';

// GET – כל ההזמנות עם פרטי ספק ומוצרים
export const getAllOrders = async (req, res) => {

  try {
    const orders = await Order.find()
      .populate('provider_id')
      .populate('products.productId');

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST – יצירת הזמנה (admin בלבד)
export const createOrder = async (req, res) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'גישה נדחתה – רק למנהל מותר ליצור הזמנה' });
    }

    const { providerId, items } = req.body;

    // שליפת כל המוצרים מה-DB לפי המזהים
    const productIds = items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    // חישוב סכום כולל
    let totalAmount = 0;
    const productsMap = {};
    products.forEach(p => { productsMap[p._id.toString()] = p; });

    for (const item of items) {
      const product = productsMap[item.productId];
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.productId}` });
      }
    totalAmount += product.price_per_item * item.quantity;
    }

    const orderData = {
      provider_id: new mongoose.Types.ObjectId(providerId),
      products: items.map(item => ({
        productId: new mongoose.Types.ObjectId(item.productId),
        quantity: item.quantity
      })),
      status: 'הוזמן',
      totalAmount // הוספת שדה סכום
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (err) {
    console.log("❌ שגיאה בשמירה:", err);
    res.status(400).json({ message: err.message });
  }
};

// PUT – עדכון הזמנה (admin או provider)
// export const updateOrder = async (req, res) => {
//   console.log("ia am in update");
//   console.log(req.body);
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ message: 'הזמנה לא נמצאה' });

//     // בדיקת הרשאה
//     const userRole = req.user?.role;
//     const userId = req.user?.id;

//     if (
//       userRole !== 'admin' &&
//       !(userRole === 'provider' && order.providerId.toString() === userId)
//     ) {
//       return res.status(403).json({ message: 'אין לך הרשאה לעדכן את ההזמנה הזו' });
//     }

//     const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
//       .populate('providerId')
//       .populate('products.productId');

//     res.json(updated);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

export const updateOrder = async (req, res) => {
  console.log("ia am in update");
  console.log(req.body);
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'הזמנה לא נמצאה' });

    // בדיקת הרשאה
    const userRole = req.user?.role;
    const userId = req.user?.id;

    if (
      userRole !== 'admin' &&
      // !(userRole === 'provider' && order.providerId.toString() === userId)
      !(userRole === 'provider' && order.provider_id.toString() === userId )
    ) {
      return res.status(403).json({ message: 'אין לך הרשאה לעדכן את ההזמנה הזו' });
    }

    // עדכון רק של סטטוס
    if (!req.body.status) return res.status(400).json({ message: "Missing status" });

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
      .populate('provider_id')
      .populate('products.productId');

      if (!updated) {
        return res.status(404).json({ message: 'הזמנה לא נמצאה' });
      }
    res.json(updated);
  } catch (err) {
  console.log("updateOrder error:", err);
  res.status(400).json({ message: err.message });
}
};
