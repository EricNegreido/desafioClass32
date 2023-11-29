import { Router } from "express";
import passport from 'passport';
import { authLogin, failLogin, failRegister, githubAuth, githubLogin, logout, register } from "../controllers/sessions.controller.js";


const router = Router()
//Login
router.post('/login', passport.authenticate('login', {failureRedirect: 'fail-login'}), authLogin);

router.get('/logout', logout);

router.get('/fail-login', failLogin); 

//git
router.get('/github', passport.authenticate('github', {scope:['user:email']}), githubAuth);

router.get('/github-callback', passport.authenticate('github', {failureRedirect: '/login'}), githubLogin);

//REGISTER

router.post('/register', passport.authenticate('register', {failureRedirect: 'fail-register'}),  register);

router.get('/fail-register', failRegister); 



export default router;

