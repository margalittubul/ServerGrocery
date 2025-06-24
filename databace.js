import dotenv from 'dotenv';
dotenv.config(); 
// טוען משתני סביבה מתוך קובץ .env (כמו DB_URI)

import mongoose from 'mongoose';

const uri = process.env.DB_URI; 
// שולף את כתובת החיבור למסד הנתונים מתוך משתני הסביבה

const connectDB = async () => {
    try {
        await mongoose.connect(uri); 
        // מנסה להתחבר למסד הנתונים באמצעות Mongoose
    } catch (error) {
        console.error('Database connection failed:', error);
        // במקרה של שגיאה – מדפיס הודעת שגיאה
    }
};

const database = mongoose.connection;
// מקבל את החיבור למסד הנתונים כדי לעקוב אחר אירועים

database.on('error', (error) => {
    console.log('Database error:', error);
    // אירוע שגיאה – אם קורה משהו רע בחיבור
});

database.once('connected', () => {
    console.log('Database connected!');
    // אירוע חד-פעמי כשמתבצעת התחברות מוצלחת
});

connectDB(); 
// קורא לפונקציית ההתחברות

export default connectDB; 
// מייצא את הפונקציה כדי שתוכל לשמש בקבצים אחרים
