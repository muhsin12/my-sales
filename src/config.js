// config.js

const DB_URI = process.env.DB_CONNECTION_URL;
const END_POINT = {
  PRODUCT_CATEGORY: "/api/category",
  PRODUCT: "/api/products",
  EXPENSE_CATEGORY: "/api/purchase-category",
  EXPENSE: "/api/purchases",
  SALES: "/api/sales",
  SALES_DETAIL: "/api/sales-details",
};
module.exports = {
  // MongoDB connection URI
  DB_URI,

  // Port number for the server
  PORT: 3000,

  END_POINT,
};
