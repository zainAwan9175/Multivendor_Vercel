const express = require('express');
const app = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandlerMiddleware = require('./middleware/error');

// Controllers
const user = require('./controller/userController');
const shop = require('./controller/shopController');
const coupon = require('./controller/couponController');
const product = require('./controller/productController');
const event = require('./controller/eventController');
const conversation = require('./controller/conversationController');
const payment = require('./controller/paymentController');
const order = require('./controller/orderController');
const message = require('./controller/messagesController');
const withdraw = require('./controller/withdrawController');

// ✅ CORS - allow frontend access (local and vercel)
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://multivendor-client.vercel.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ✅ Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// ✅ File Upload
app.use(fileUpload({ useTempFiles: true }));

// ✅ Sample route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ All routes
app.use('/user', user);
app.use('/shop', shop);
app.use('/coupon', coupon);
app.use('/product', product);
app.use('/event', event);
app.use('/conversation', conversation);
app.use('/payment', payment);
app.use('/order', order);
app.use('/message', message);
app.use('/withdraw', withdraw);

// ✅ Global Error Handler (must be last)
app.use(errorHandlerMiddleware);

// ✅ Export the app
module.exports = app;
