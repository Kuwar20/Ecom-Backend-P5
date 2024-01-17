import express from 'express';
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';
import NodeCache from 'node-cache';
import { config } from 'dotenv';
import morgan from 'morgan';

// Importing Routes
import userRoute from './routes/user.js';
import productRoute from './routes/products.js';
import orderRoute from './routes/order.js';


config({
    path: "./.env"
});

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || "";

connectDB(mongoURI);

// store in Ram memory
export const myCache = new NodeCache();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

// Using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

// test api to check if api is working at: http://localhost:PORT/
app.get("/", (req, res) => {
    res.send("API WORKING FINE ON /api/v1");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})