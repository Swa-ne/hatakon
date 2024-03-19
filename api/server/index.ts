import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import schedule from 'node-schedule';
import dotenv from 'dotenv';
import { verify } from 'jsonwebtoken';
dotenv.config();

import entryRoutes from './routes/entry';
import { authenticateToken } from './middleware/authentication';

const app = express();
const server = http.createServer(app);
const port = 3000;

const MONGODB_CONNECTION: any = process.env.MONGODB_CONNECTION;
const ORIGIN_URL: any = process.env.ORIGIN_URL || ['https://client-72q1e2aab-dreamers-projects-82b45cfd.vercel.app/', '*'];

mongoose
    .connect(MONGODB_CONNECTION)
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('Internal Server Error');
    });

app.use(
    cors({
        origin: 'http://127.0.0.1:5173',
        credentials: true,
    })
);
app.use(express.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use('/entry/', entryRoutes);

// schedule.scheduleJob('*/1 * * * *', () => {
//     addReminderNotification();
// });

app.get('/', (req, res) => {
    res.send('Hello from your Node.js Express server!');
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// export const io = new Server(server, {
//     cors: {
//         origin: 'http://127.0.0.1:5173',
//     },
// });

// io.on('connection', (socket: any) => {
//     socket.on('join_classes', (token: any) => {
//         if (token == null) socket.to(socket.id).emit('unauthorized', { message: 'Unauthorized' });

//         verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
//             if (err || !user) socket.to(socket.id).emit('unauthorized', { message: 'Unauthorized' });
//             joinClass(user, socket);
//         });
//     });
// });
