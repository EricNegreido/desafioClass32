import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/sessions.router.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import ticketRouter from './routes/ticket.router.js';
import mailerRouter from './routes/mailer.router.js';
import mockRouter from './routes/mock.router.js';
import intializePassport from './config/passport.config.js';
import passport from 'passport';
import config from './config/config.js';
import errorHanlder from './middleware/errors/index.js';
import { Server } from 'socket.io';

const MONGO_URL = config.mongoUrl;
const SESSIONS_SECRETE = config.sessionSecrete;

const app = express();


try {
    await mongoose.connect(MONGO_URL);
    console.log('BBD connected App');
} catch (error) {
    console.log(error.message);
    
}

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`));



app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');


app.use(session({
    store: MongoStore.create({
        client:mongoose.connection.getClient(),
        ttl: 60
        
    }),
    secret: SESSIONS_SECRETE,
    resave: true,
    saveUninitialized: true
}));
intializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/api/mail', mailerRouter);
app.use('/api/ticket', ticketRouter);
app.use('/api/mockingproducts', mockRouter);
app.use(errorHanlder);



const httpServer  = app.listen(8080, () => console.log('server running'));

const io = new Server(httpServer);

let messages = [];
io.on('connection', socket => {
    console.log("Nuevo cliente conectado");

    socket.on('authenticate', () =>{

        socket.emit("messageLogs", messages);
    })
    
    socket.on('message', data => {
        messages.push(data);
        io.emit('messageLogs', messages);
    });

    socket.broadcast.emit('userConnected', {user: 'Nuevo usuario conectado'});

});



