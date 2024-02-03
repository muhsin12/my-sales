// config.js

const DB_URI =
  process.env.DB_SERVER === "local"
    ? process.env.DB_LOCAL
    : process.env.DB_REMOTE;
module.exports = {
  // MongoDB connection URI
  DB_URI,

  // Port number for the server
  PORT: 3000,

  // API keys or any sensitive information
  API_KEY: "your-api-key-here",

  // Other configuration settings
};
