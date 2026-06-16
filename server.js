process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import cors from "cors";
import connectDataBase from "./config/db.js";
connectDataBase()
import news from "./routes/news.js"
import price from "./routes/price.js"
import subscribe from "./routes/subscribe.js"
import summary from "./routes/summary.js"





// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use('/api/news', news);
app.use('/api/prices', price);
app.use('/api/subscribe', subscribe);
app.use('/api/summary', summary);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



