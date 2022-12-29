import express from 'express';
const app = express(); 
import cors from 'cors'; 
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config(); 
 

import errorHandler from "./middleware/error.js"; 
import postRoutes from './routes/posts.js';
/* import claimRouter from "./routes/claim.js"; */
import authRoute from "./routes/auth.js";

app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors({
  origin: '*'
}));
 
 
//first parameter is the starting path in the backend e.g localhost:5000/posts
//Connecting 
app.use('/posts', postRoutes); 
/* app.use("/claim", claimRouter); */
/* app.use("/auth", authRoute); */
app.use(authRoute)



app.get("/", (req, res, next) => {
  res.send("Api running");
});


process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});



connectDB();
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Sever running on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
