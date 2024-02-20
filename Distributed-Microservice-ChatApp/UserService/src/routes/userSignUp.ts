import express from 'express';
import { checkUser, validateUser } from '../helpers/helper';
import { signUp } from '../controllers/signUpController';
var signUpRoute = express.Router();
signUpRoute.post('/api/signUp/', checkUser, signUp);
export {signUpRoute};