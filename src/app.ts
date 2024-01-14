import express from 'express';
import userRoute from './routes/user.js';
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';
const app = express();
const port = 3000;

app.use(express.json());

connectDB();

app.use("/api/v1/user", userRoute);

app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})