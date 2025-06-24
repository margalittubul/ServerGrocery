import jwt from 'jsonwebtoken';

// Middleware לאימות טוקן JWT
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization; // שולף את כותרת האותנטיקציה

    const token = authHeader.slice(7); // מוציא את הטוקן (מניח שמתחיל ב-"Bearer ")
    if (!token) {
        return res.status(401).json({ message: 'Invalid token format' }); // אם אין טוקן, מחזיר שגיאה
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // מאמת את הטוקן עם הסוד
        req.user = decoded; // מוסיף את המידע מהטוקן לבקשה
        next(); // ממשיך לבקר הבא
    } catch (e) {
        res.status(403).json({ message: 'Invalid or expired token' }); // טוקן לא תקין או פג תוקף
    }
};

// Middleware לבדיקת תפקיד משתמש
const roleMiddleware = (role) => (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Access denied: No user found' }); // אם אין משתמש מאומת
    }
    if (req.user.role !== role) {
        return res.status(403).json({ message: `Access denied: Only ${role}s can perform this action` }); // בדיקת תפקיד
    }
    next(); // אם הכל תקין, ממשיך
};

export { authMiddleware, roleMiddleware };
