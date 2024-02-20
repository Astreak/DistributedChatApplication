import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

var LandingPage = (props:{validated:boolean, user:any}) => {
   const [time, setTime]: [string, Dispatch<SetStateAction<string>>] = useState(new Date().toLocaleTimeString());
   const navigate = useNavigate();
   useEffect(() => {
         if(props.user === null || props.user===undefined){
            navigate("/signIn");
         }else{
            setInterval(() => {
               setTime(new Date().toLocaleTimeString());
            }, 1000);
         }
   },[]);
   return (
      <div className="landing-page">
         <div className="time-data">
            <h3>{time}</h3>
         </div>
         <div className="main-text">
            <header className="header">
               Welcome to <strong>@AlgoChat</strong> 
            </header><br/>
         </div>
      </div>
   )
}
export default LandingPage