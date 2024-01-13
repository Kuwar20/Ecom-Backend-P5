import express from 'express';
import userRoute from './routes/user.js';
import { connectDB } from './utils/features.js';
const app = express();
const port = 3000;


app.use(express.json());

connectDB();

/* 
// test api
app.get("/", (req, res) => {
res.send("API is working with /api/v1")
}) */

app.use("/api/v1/user", userRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
