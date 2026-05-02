require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");

const PORT = process.env.PORT || 5000;

connectToDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 HireMind server running on http://localhost:${PORT}`));
});
