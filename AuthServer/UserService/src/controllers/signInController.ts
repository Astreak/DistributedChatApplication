import client from "../config/connectDB";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { Request, Response } from "express";
var signIn = (req: Request, res: Response) => {
   const accessSecretKey: any = process.env.ACCESS;
   const refreshSecretKey:any = process.env.REFRESH;
   const email = req.body.email;
   const password = req.body.password;
   if (res.locals.userExists === false) {
      res.status(401).send({
         'message': 'User doesn"t exists ',
         'status': 401
      });
      return;
   }
   client.query('SELECT Id, firstname, lastname, phone, email, password from users WHERE email = $1', [email])
      .then((d) => {
         const userData = d.rows[0];
         userData["username"] = userData.firstname + ' '+userData.lastname;
         //console.log(userData);
         bcrypt.compare(password, userData.password)
            .then((result) => {
               if (result == false) {
                  res.status(403).send({ "msg": "Wrong Password" });
                  return;
               } else {
                  const accesstoken = jwt.sign({
                     id: userData.id,
                     email: userData.email,
                     username : userData.username
                  }, accessSecretKey, { expiresIn: '15m' }); // accessSecretJet is used for frequent accessTokens
                  const refreshToken = jwt.sign({
                     id: userData.id,
                     email:userData.email,
                     username: userData.username
               }, refreshSecretKey, { expiresIn: '1d'}); // refreshtoken is used for regeneration of freq accessToken
                  delete userData['password'];
                  res.cookie("accesstoken",accesstoken,{
                     httpOnly:true,
                     maxAge: 9000
                  });
                  res.cookie("refreshtoken",refreshToken,{
                     httpOnly:true,
                     maxAge: 1900000
                  });
                  res.set("Access-Control-Allow-Credentials", 'true');
                  res.set("Access-Control-Allow-Origin","http://localhost:3000");
                  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

                  res.status(201).send({
                     'refreshtoken': refreshToken,
                     'accesstoken': accesstoken,
                     'userId': userData.username,
                     'message': 'Successfully login',
                     'status': 201,
                     'data': userData
                  });
               }
            }).catch((ex) => {
               console.log(`Error  in logging in ${ex}`);
               res.status(501).send({
                  'message': 'Some Error occurred',
                  'status': 501
               });
            });
      }).catch((e) => {
         console.log(`Error: ${e}`);
         res.status(501).send({
            'message': 'Some Error occurred',
            'status': 501
         });
      });
}
export { signIn };