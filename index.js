import express from 'express'; 
// מייבא את Express – ספריית שרת ליצירת API ושרת HTTP

import cors from 'cors'; 
// מייבא את CORS – מנגנון שמאפשר גישה לשרת ממקורות שונים (Cross-Origin)

import bodyParser from 'body-parser'; 
// מייבא body-parser – כדי לפרש נתונים ב-JSON מהבקשות

import connectDB from './databace.js'; 
// מייבא את פונקציית החיבור למסד הנתונים (שכתבת לפני כן)

import productRoutes from './routes/productRoutes.js'; 
import providerRoutes from './routes/providerRoutes.js'; 
import orderRoutes from './routes/orderRoutes.js'; 
import userRoutes from './routes/userRoutes.js';
// מייבא את הנתיבים (Routes) של המוצרים, הספקים וההזמנות

const app = express(); 
// יוצר אפליקציית Express

const port = 3000; 
// מגדיר את הפורט שהשרת ירוץ עליו

connectDB(); 
// מפעיל את הפונקציה שמתחברת למסד הנתונים

app.use(cors()); 
// מאפשר CORS עבור כל הבקשות

app.use(bodyParser.json()); 
app.use(express.json()); 
// מפרש את הנתונים שנשלחים ב-JSON בגוף הבקשות

app.use('/products', productRoutes); 
app.use('/providers', providerRoutes); 
app.use('/orders', orderRoutes); 
app.use('/users', userRoutes);
// מגדיר נתיבים שונים עבור כל סוג משאב

app.listen(port, () => console.log(`Server running on http://localhost:${port}`)); 
// מפעיל את השרת ומדפיס הודעה כשהוא מוכן
