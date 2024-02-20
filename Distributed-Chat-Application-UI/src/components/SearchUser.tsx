// search bar calling user
import React, { Dispatch, SetStateAction, useState } from "react";
import '../styles/general.css';
import { useNavigate } from "react-router-dom";
type userType = {
	toUser: Object,
	setToUser:Dispatch<SetStateAction<Object>>
}
var SearchUser = (props:userType)=>{
	const [text, setText]: [string, Dispatch<SetStateAction<string>>] = useState("");
	const navigate = useNavigate();
	function handleSearch(e:any){
		e.preventDefault();
		fetch("http://localhost:4000")
		.then((d)=>{
		   if(d.status === 201 || d.status === 200){
			  const firstName = text.split(" ")[0];
			  fetch("http://localhost:4000/getUser/",{
				 method: "POST",
				 body:JSON.stringify({"firstName":firstName}),
				 headers: {
					'content-type': 'application/json;charset=utf-8',
					 // if not added server doesn't catch the req.body
				 }
			  }).then((d:any)=>{
				 return d.json();
			  })
			  .then((d:any)=>{
				const payload = JSON.parse(d.msg);
				props.setToUser(payload);
				console.log(payload);
				let link = "/easdasdasdasifnjsnfjkadsnkjasbdajskdbhasdhasdasd";
				navigate(link);
			  })
			  .catch((e)=>{
				 console.log(e);
				 //navigate("/authError")
			  });
		   }
		})
		.catch((e)=>{
		   console.log("Error connecting to the auth server");
		})
	}
	return (
		<div className="search-comp">
			<input className= "search-bar" name="search-bar" value = {text} onChange={(e)=> setText(e.target.value)}/>
			<button className= "search-btn" name = "search-btn" onClick = {handleSearch}> Send </button>
		</div>
	)
}
export {SearchUser};