import React, { useState } from "react";
import '../styles/general.css';
import { useNavigate } from "react-router-dom";
const SignUp = () => {
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirm] = useState("");
   const [phone, setPhone] = useState("");
   const navigate = useNavigate();
   let onSubmit = async(e:any)=>{
      e.preventDefault();
      let payload: string = JSON.stringify({
         firstname : firstName,
         lastname: lastName,
         phone: phone,
         email : email,
         password : password,
         confirmpass : confirmPassword
      });

      var data:any = await fetch("http://localhost:4000/api/signUp/",{
         method: "POST",
         body:payload,
         headers: {
            'content-type': 'application/json;charset=utf-8'
         }
         
      });
      if(data.status === 200 || data.status === 201){
         navigate("/signin");
      }
   }
   return (
      <div className= "singInForm">
          <header className= "SignIn"> SignUp </header>
         <form>
            <input className ="signin-inp" name="FirstName" type="text" value = {firstName } onChange ={(e) => setFirstName(e.target.value)} placeholder="Enter your FirstName"/><br/>
            <input className ="signin-inp" name="LastName" type="text" value = {lastName } onChange ={(e) => setLastName(e.target.value)} placeholder="Enter your LastName"/><br/>
            <input className ="signin-inp" name="email" type="email" value = {email} onChange ={(e) => setEmail(e.target.value)} placeholder="Enter your email"/><br/>
            <input className = "signin-inp" name="Phone" type="password" value = {phone } onChange ={(e) => setPhone(e.target.value)} placeholder="Enter your Phone no"/><br/>
            <input className = "signin-inp" name="password" type="password" value = {password } onChange ={(e) => setPassword(e.target.value)} placeholder="Enter your password"/><br/>
            <input className ="signin-inp" name="confirm-password" type="password" value = {confirmPassword } onChange ={(e) => setConfirm(e.target.value)} placeholder="Confirm Password"/><br/>
            <button className="signup-btn" name="signup-btn" onClick={onSubmit}>SignUp</button>
         </form>
      </div>
   )
}
export { SignUp };