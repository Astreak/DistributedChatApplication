import client from "../config/connectDB";
import bcrypt from 'bcrypt';
var signUp = (req: any, res: any) => {
   const saltRounds = 10;
   const firstName: string = req.body.firstname;
   const lastName:string = req.body.lastname;
   const email:string = req.body.email;
   const password:string = req.body.password;
   const confirmPass:string = req.body.confirmpass;
   const phone: string = req.body.phone;
   if (res.locals.userExists == true) {
      res.status(404).send({
         'message': 'USER Already exists with the email',
         'status':401
      });
      return;
   }
   if (password != confirmPass) {
      res.status(404).send({
         'message': "Password didn't matched",
         'status':401
      });
      return;
   }
   bcrypt.hash(password, saltRounds)
      .then(( hashPass ) => {
         let listData = [firstName, lastName, email, hashPass, phone];
         client.query('INSERT INTO users ( firstname , lastname , email, password, phone) VALUES($1, $2, $3, $4, $5)', listData)
            .then((d) => {
               console.log("Data Inserted Successfully ");
               res.status(201).send({ 'message': 'SUCCESS', 'status': 201 });
               return ;
            }).catch((err) => {
               console.log(`Error in inserting data ${err}`);
               res.status(501).send({
                  'message': 'Some Error occurred',
                  'status': 501
               });
               return ;
            });
      }).catch((err) => {
         console.log(`Error : ${err}`);
         res.status(501).send({
            'message': 'Some Error occurred',
            'status': 501
         });
         return ;
      });
}
export { signUp };