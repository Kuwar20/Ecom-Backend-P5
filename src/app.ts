import express from 'express';
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';

// Importing Routes
import userRoute from './routes/user.js';
import productRoute from './routes/products.js';

const port = 3000;

connectDB();

const app = express();

app.use(express.json());

// Using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})