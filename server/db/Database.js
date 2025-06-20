// db/Database.js

const mongoose = require('mongoose');

const connectDatabase = () => {
  mongoose.connect("mongodb+srv://root:root@lms.j2ehk.mongodb.net/?retryWrites=true&w=majority&appName=LMS")
    .then(() => {
      console.log('MongoDB connected successfully');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
};

module.exports = connectDatabase;
