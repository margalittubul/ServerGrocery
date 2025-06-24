import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  //עדיין לא החלטתי אם להוסיף קוד ספק
  name: {
    type: String,
    required: true,          // חייבת להיות מחרוזת, לא יכולה להיות ריקה
  },
  price_per_item: {
    type: Number,
    required: true,          // חייב להיות מספר
    min: 0                  // לא יכול להיות שלילי
  },
  minimum_purchase_quantity: {
    type: Number,
    required: true,          // חייב להיות מספר
    min: 1,                 // מינימום 1
    validate: {
      validator: Number.isInteger, // חייב להיות מספר שלם
      message: 'Quantity must be an integer'
    }
  }
});

export default mongoose.model('Product', productSchema);
