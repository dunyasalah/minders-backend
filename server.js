const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]); 

require('dotenv').config();

console.log(process.env.MONGO_URI);

const app = require('./src/app');
const connectDatabase = require('./src/config/database');

const PORT = process.env.PORT || 5000;

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});