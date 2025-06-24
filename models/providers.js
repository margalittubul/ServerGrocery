import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  company_name: {
    type: String, // סוג הערך: מחרוזת
    required: [true, 'Company name is required'], // שדה חובה עם הודעת שגיאה מותאמת
    trim: true, // מסיר רווחים בתחילת ובסוף המחרוזת
    minlength: [2, 'Company name too short'] // אורך מינימלי של 2 תווים
  },
  phone: {
    type: String, // מספר טלפון כטקסט (String)
    required: [true, 'Phone number is required'], // שדה חובה
    trim: true, // מסיר רווחים מיותרים
    //לא שימושי להיום 
    // validate: { // ולידציה מותאמת אישית
    //   validator: function(v) {
    //     // פונקציה שבודקת האם הפורמט תואם לתבנית טלפון פשוטה
    //     // כאן: 2-3 ספרות, רווח או מקף אופציונלי, 6-7 ספרות
    //     return /^\d{2,3}[-\s]?\d{6,7}$/.test(v);
    //   },
    //   message: props => `${props.value} is not a valid phone number!` // הודעת שגיאה מותאמת במקרה של כשל
    // }
  },
  Representative_name: {
    type: String, // שם הנציג כמחרוזת
    required: [true, 'Representative name is required'], // שדה חובה
    trim: true, // מסיר רווחים בתחילת ובסוף
    minlength: [2, 'Representative name too short'] // אורך מינימלי
  },
  password: {
    type: String,
    required: true,
    minlength: 6 
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId, // מערך של מזהי אובייקטים (קישורים לאובייקטים אחרים)
    ref: 'Product' // מציין שמדובר בהפניה לאוסף 'Product'
  }]
});

// ייצוא המודל בשם 'Provider', שמונגו ישתמש בו לאוסף 'providers'
export default mongoose.model('Provider', providerSchema);
