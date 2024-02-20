import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import '../styles/general.css';
import { useNavigate } from "react-router-dom";
const SignIn = (props:any) => {
   const [email, setEmail ]: [string, Dispatch<SetStateAction<string>>] = useState("");
   const [password, setPassword]: [string, Dispatch<SetStateAction<string>>] = useState("");
   useEffect(()=>{
      if(props.user ===null || props.user === undefined){
         navigate("/");
      }
   },[]);
   const navigate = useNavigate();
   let onSubmit = (e:any)=>{
      e.preventDefault();
      fetch("http://localhost:4000/validateUser/",{
         credentials:"include" // to send the httpOnly cookie to the server ; on the server end make sure Allow-credentials are true
      })
      .then((d)=>{
         //console.log("Some data: ",d);
         return d.json();
      })
      .then((resp:any )=>{
            console.log("Some data: ",resp);
            if(resp.user === undefined || resp.user === null){
               fetch("http://localhost:4000/api/signIn/",{
                  method: "POST",
                  body:JSON.stringify({"email":email, "password":password}),
                  credentials: 'include',
                  headers: {
                     "content-type": 'application/json;charset=utf-8',
                     // if not added server doesn't catch the req.body
                  }
               }).then((d:any)=>{
                  return d.json();
               })
               .then((d:any)=>{
                  // props.setLoginInfo(d);
                  // props.setToken(d.accesstoken);
                  // blacklistServer.setex(email+"ACC",d.accesstoken,15,()=>{
                  //    console.log("Access token Updated in database");
                  // });
                  // blacklistServer.setex(email+"REF",d.refreshtoken, 15,()=>{
                  //    console.log("Refresh token updated");
                  // });
                  props.setToken(d.refreshtoken);
                  navigate("/");
               })
               .catch((e)=>{
                  console.log(e);
                  //navigate("/authError")
               });
         }else{
            props.setUser(resp.user);
            navigate("/");
         }
      })
      .catch((e)=>{
         console.log("Error connecting to the auth server: ",e);
      })
   }
   var redirectSignUp = (e:any)=>{
      e.preventDefault();
      navigate("/signUp");
   }
   return (
      <div className= "singInForm">
          <header className= "SignIn"> SignIn </header>
         <form>
            <input className ="signin-inp" name="email" type="email" value = {email} onChange={(e)=> setEmail(e.target.value)} placeholder="Enter your email"/><br/>
            <input className = "signin-inp" name="password" type="password" value ={password} onChange = {(e) => setPassword(e.target.value)} placeholder="Enter your password"/><br/>
            <span className="button-span">
               <button className="signin-btn" name="signin-btn" onClick={onSubmit}>SignIn</button>
               <button className = "signup-btn" name = "signup-btn" onClick = {redirectSignUp}>SignUp</button>
            </span>
         </form>
      </div>
   )
}
export { SignIn };