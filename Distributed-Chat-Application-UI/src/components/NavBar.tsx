import React from "react";
import { Link } from "react-router-dom";
import '../styles/general.css';
var NavBar = (props:any) => {
   var comp = "";
   if(props.user!==null && props.user!==undefined){
      console.log(props.user);
      comp = JSON.parse(props.user).username;
   }
   return (
      <div className="navbar">
            <Link to='/'><h4 className="ele-home">Home</h4></Link>
            <Link to='/chats'><h4 className="ele-chat">Chat</h4></Link>
            <Link to ='/signin'><h4 className="ele-sigin"> SignIn </h4></Link>
            <Link to ='/signup'><h4 className="ele-sigup"> SignUp </h4></Link>
            <p className = "username"> {comp} </p>
      </div>
   )
}
export default NavBar;