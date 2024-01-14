import express from 'express';
import { deleteUser, getAllUsers, getUser, newUser } from '../controllers/user.js';
import { adminOnly } from '../middlewares/auth.js';

const app = express.Router();

// route - /api/v1/user/new
app.post("/new", newUser);

// route - /api/v1/user/all
app.get("/all", adminOnly, getAllUsers);


app.route("/:id").get(getUser).delete(adminOnly, deleteUser);

/* 
//because they have the same route we can do this instead

// route - /api/v1/user/dynamicID
app.get("/:id", getUser);

// route - /api/v1/user/dynamicID
app.delete("/:id", deleteUser);

*/

export default app;