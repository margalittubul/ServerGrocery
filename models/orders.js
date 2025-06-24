import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  provider_id: {
    type: mongoose.Schema.Types.ObjectId, // מזהה אובייקט המצביע על מסמך ספק
    ref: 'Provider',                     // קישור לאוסף 'Supplier' (הספקים)
    required: true                      // שדה חובה - חייב להיכלל
  },
 products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      }
    }
  ],
  status: {
    type: String,                       // מחרוזת לתיאור מצב ההזמנה
    enum: ['הוזמן', 'בתהליך', 'הושלם'], // מוגדרים מצבים חוקיים בלבד להזמנה
    default: 'הוזמן',                  // ערך ברירת מחדל אם לא יוזן ערך אחר
    required: true                     // שדה חובה
  },
    totalAmount: {
    type: Number,
    required: true
  }
});

// ייצוא המודל בשם 'Order' לשימוש בקבצים אחרים
export default mongoose.model('Order', orderSchema);
