// מייבא את ספריית Express כדי להשתמש בראוטים.
import express from 'express';
//מייבא את הפונקציות שמטפלות בבקשות – מתוך קובץ הקונטרולר של הזמנות.
import {
  getAllOrders,
  createOrder,
  updateOrder
} from '../controller/orderController.js';

import {authMiddleware , roleMiddleware } from '../authMiddleware.js';
//ייבוא של המידלוור

//יוצר מופע של 
// Router – 
// זה מאפשר להגדיר מסלולים 
// (Routes)
//  נפרדים.
const router = express.Router();

//כשמישהו פונה ל־G
// ET /orders, 
// מופעלת הפונקציה 
// getAllOrders.
//וכך שאר הפונקציות
router.get('/',authMiddleware, getAllOrders);
router.post('/',authMiddleware,roleMiddleware('admin'), createOrder);
router.put('/:id',authMiddleware, updateOrder);
//מייצא את ה־
// Router 
// הזה החוצה, כדי שאפשר יהיה לחבר אותו בקובץ הראשי 
// (app.js).
export default router;
