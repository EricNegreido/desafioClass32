import passport from "passport";
import local from 'passport-local';
import usersModel from "../dao/dbManagers/models/users.models.js";
import GitHubStrategy from 'passport-github2';
import {createHash, isValidPassword} from "../utils.js";
import config from "./config.js";
import { addCartService } from "../services/carts.services.js";

const LocalStrategy = local.Strategy;
const GIT_SECRETE = config.gitSecrete;
const USER_ADMIN = config.userAdmin;
const PASSW_ADMIN = config.passwordAdmin;


const intializePassport = () => {

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.6b11166cca03c44c',
        clientSecret: GIT_SECRETE,
        callbackURL:  'http://localhost:8080/api/sessions/github-callback',
        scope: ['user:email']
    }, async(accessToken, refreshToken, profile, done ) => {//lo siguente se ejecuta una vez authenticados en git hub
        try {

            const email = profile.emails[0].value;

            const user = await usersModel.findOne({email});

            if(!user){
            const cart = addCartService();
                const newUser = {
                    first_name: profile._json.name ? profile._json.name : profile._json.login,
                    last_name : '',
                    age: 5,
                    email,
                    password: '',
                    cart: cart._id,
                    rol: 'User'
                };
            
                const result = await usersModel.create(newUser);
                return done(null, result);
            }else{

                return done(null, user);
            }

        } catch (error) {
            return done(error);
        }
    }))

    
    passport.use('login', new LocalStrategy({
            usernameField: 'email'
        }, async(username, password, done) =>{

            try {
                const user = await usersModel.findOne({ email: username}); 
    
                if(!user){
                    return done(null, false);
                }

                if(!isValidPassword(password, user.password)){
                    return done(null, false);
                }
                
                return done(null, user); // se setea en req.user
            } catch (error) {
                return done(`Error al loguear usuario, ${error.message}`);

            }
        }));

    passport.use('register', new LocalStrategy({
        passReqToCallback : true, //permite acceder al obj req
        usernameField: 'email' //por defecto espera recibir un user -> cambiamos por email

    }, async(req, username, password, done/* callback para retornar exito o error*/) =>{

        const email = username;
        try {
            const {first_name, last_name, age} = req.body;
            
            const exists = await usersModel.findOne({email});
            if(exists){
                return done(null, false);
                
            }
           
            const rol = (email === USER_ADMIN && password === PASSW_ADMIN ) ? 'Admin' : 'User';
            const cart = await addCartService();

            console.log(cart);
            const user = await usersModel.create({
                first_name,
                last_name, 
                email,
                age,
                password: createHash(password),
                cart: cart._id,
                rol: rol

    
            });
            
            return done(null, user);            
        } catch (error) {
            return done(`Error al registrar usuario, ${error.message}`);
    
        }
    }))
    
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser( async (id, done) =>{
        const user = await usersModel.findById(id);
        done(null, user); 
    });

};

export default intializePassport;


