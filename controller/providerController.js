import Provider from '../models/providers.js';
import User from '../models/user.js';
import Product from '../models/products.js';
import mongoose from 'mongoose';

// GET – כל הספקים כולל המוצרים
export const getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find().populate('products');
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProvider = async (req, res) => {
  try {
    const {
      companyName,
      phone,
      representativeName,
      password,
      products
    } = req.body;

    console.log('✅ Received data:', req.body);

    // בדיקה אם ספק עם אותו טלפון כבר קיים
    const existingProvider = await Provider.findOne({ phone });
    if (existingProvider) {
      return res.status(400).json({ message: 'Provider already exists' });
    }

    console.log("📞 בדיקת טלפון:", phone);

    // בדיקה אם משתמש עם אותו שם קיים
    const existingUser = await User.findOne({ username: phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    console.log("👤 בדיקת משתמש:", phone);

    // יצירת מזהה משותף
    const sharedId = new mongoose.Types.ObjectId();

    // יצירת המוצרים
    const createdProducts = await Product.insertMany(products);
    const productIds = createdProducts.map(p => p._id);

    console.log("✅ Created products:", productIds);

    // יצירת ספק עם המזהה המשותף
    const provider = new Provider({
      _id: sharedId,
      company_name: companyName,
      phone,
      Representative_name: representativeName,
      password,
      products: productIds
    });

    console.log("✅ Provider to save:", provider.toObject());

    await provider.save();
    console.log("✅ Provider saved");

    // יצירת משתמש עם אותו מזהה בדיוק
    const user = new User({
      _id: sharedId,
      username: representativeName, 
      password,
      role: 'provider'
    });

    await user.save();
    console.log("✅ User saved");

    res.status(201).json({ message: 'Provider created', success: true });
  } catch (err) {
    console.error("❌ Error in createProvider:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const addProductToProvider = async (req, res) => {
  try {
    const providerId = req.user?.id; // מתוך ה־JWT
    const { productId } = req.body;

    console.log("📥 בקשה להוספת מוצר לספק");
    console.log("🧾 providerId מתוך JWT:", providerId);
    console.log("📦 productId מהגוף:", productId);

    if (!productId) {
      console.warn("⚠️ חסר productId בבקשה");
      return res.status(400).json({ message: "Missing productId" });
    }

    const provider = await Provider.findById(providerId);
    if (!provider) {
      console.warn("❌ ספק לא נמצא:", providerId);
      return res.status(404).json({ message: "Provider not found" });
    }

    // בדיקה אם המוצר כבר משויך
    const alreadyExists = provider.products.includes(productId);
    console.log("🔍 האם המוצר כבר קיים אצל הספק?", alreadyExists);

    if (!alreadyExists) {
      provider.products.push(productId);
      await provider.save();
      console.log("✅ המוצר נוסף לספק בהצלחה");
    } else {
      console.log("ℹ️ המוצר כבר קיים אצל הספק, לא בוצעה הוספה כפולה");
    }

    res.status(200).json({ message: "Product added to provider successfully" });

  } catch (err) {
    console.error("❌ שגיאה ב־addProductToProvider:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getProviderProducts = async (req, res) => {
  try {
    const providerId = req.user?.id;

    if (!providerId) {
      return res.status(401).json({ message: 'Unauthorized – missing provider ID' });
    }

    // שלב 1: שליפת מזהי המוצרים של הספק בלבד
    const provider = await Provider.findById(providerId).select('products');

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const productIds = provider.products;

    if (!productIds || productIds.length === 0) {
      return res.status(200).json([]); // אין מוצרים, מחזיר רשימה ריקה
    }

    // שלב 2: שליפת המוצרים לפי מזהים
    const products = await Product.find({ _id: { $in: productIds } });

    return res.status(200).json(products);
  } catch (err) {
    console.error('❌ Error in getProviderProducts:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getProviderDetails = async (req, res) => {
  try {
    const providerId = req.user?.id; // מזהה הספק מתוך ה־JWT

    if (!providerId) {
      return res.status(401).json({ message: 'Unauthorized – missing provider ID' });
    }

    // שליפת הספק עם כל הפרטים, כולל פרטי המוצרים (populate)
    const provider = await Provider.findById(providerId)
      .populate('products') // מאכלס את שדות המוצרים בפרטים מלאים
      .select('-password'); // לא מחזיר את הסיסמה (לשמור על אבטחה)

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.status(200).json(provider);
  } catch (err) {
    console.error('❌ Error in getProviderDetails:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// שליפת מוצרים של ספק לפי מזהה (עבור אדמין בלבד)
export const getProviderProductsById = async (req, res) => {
  try {
    // רק אדמין מורשה
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'גישה נדחתה – אדמין בלבד' });
    }

    const { providerId } = req.params;

    const provider = await Provider.findById(providerId).select('products');
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const products = await Product.find({ _id: { $in: provider.products } });
    res.status(200).json(products);
  } catch (err) {
    console.error('❌ Error in getProviderProductsById:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
