import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; 
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from 'path';

dotenv.config(); 
 

import errorHandler from "./middleware/error.js"; 
import postRoutes from './routes/posts.js';
import authRoute from "./routes/auth.js";

  const app = express();



app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use('/posts', postRoutes); 
app.use(authRoute)



app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'path/to/your/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
});
/* app.get('/*', function(req, res) { res.sendFile('index.html');}); */
/* app.get("/", (req, res, next) => {
  res.send("Api running");
});
 */




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
