import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoute.js';
import contactRoutes from './routes/contactRoute.js';
import setupSocket from './socket.js';
import messagesRoutes from './routes/messageRoute.js';
import channelRoutes from './routes/channelRoute.js';

dotenv.config();

const app=express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
    
        origin: [process.env.ORIGIN],
        methods: ["GET","PUT","PATCH","POST","DELETE"],
        credentials: true,
      
}));

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"))

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);


const server = app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})

setupSocket(server);

mongoose.connect(databaseURL).then(()=>{console.log("db connection successful");
}).catch((err)=>console.log(err.message));