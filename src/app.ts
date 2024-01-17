import express from 'express';
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';
import NodeCache from 'node-cache';

// Importing Routes
import userRoute from './routes/user.js';
import productRoute from './routes/products.js';
import orderRoute from './routes/order.js';

const port = 3000;

connectDB();

// store in Ram memory
export const myCache = new NodeCache();

const app = express();

app.use(express.json());

// Using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})