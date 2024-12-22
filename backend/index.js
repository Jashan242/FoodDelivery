const express=require('express');
const server=express();
const userRouter = require("./routes/user");
const restaurantRouter = require("./routes/restaurant");
const foodRouter=require('./routes/foodItem');
const cartRouter=require('./routes/cart');
const orderRouter=require('./routes/orders');
const {mongoDBConnection}=require('./connection/connect');
const port=process.env.PORT || 3030;
const {checkAuth}=require('./middlewares/auth');
const cors=require('cors');
require('dotenv').config();
const cookieParser=require('cookie-parser');


mongoDBConnection("foodDelivery");

server.use(cors({
    origin: ['http://localhost:5173', 'https://food-delivery-lac-five.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: true,
    optionsSuccessStatus: 200
}));

server.use(express.json());
server.use(cookieParser());
server.use(express.urlencoded({ extended: true }));
server.use(express.urlencoded({ extended: true }));
server.use(cors());
server.use("/user", userRouter);
server.use("/restaurant", restaurantRouter);
server.use("/food", foodRouter);
server.use(checkAuth);

server.use("/cart",cartRouter);
server.use("/order",orderRouter);
server.get("/", (req, res)=>{
    res.send("Welcome to BeFoodie");
})

console.log('checkAuth:', checkAuth);

server.listen(port, ()=>{
    console.log("server is running on "+ port)
})