import React, { useEffect } from "react";
import { SearchUser } from "./SearchUser";
import { useNavigate } from "react-router-dom";
import '../styles/general.css';
import NavBar from "./NavBar";
var AllChats = (props:any) => {
	const navigate = useNavigate();
	useEffect(()=>{
		if(props.user === null){
			navigate("/signIn");
		}
		return ()=>{
			console.log("Allchat deloaded");
			//props.setToUser(null);
		}
	},[]);
	const indexedObjs = props.allChat;
	let val = [];
	let handleSelectUser = (e:any) => {
		e.preventDefault();
		//props.setToUser(null);
		console.warn(e.target.textContent);
		console.log(props.emailMap);
		const currEmail:string = props.emailMap[e.target.textContent];
		props.setToUser({email: currEmail, username: e.target.textContent});
		console.log(props.toUser);
		navigate("/easdasdasdasifnjsnfjkadsnkjasbdajskdbhasdhasdasd");

	}
	console.log(indexedObjs);
	for(const [key, value ] of Object.entries(indexedObjs)){
		const name:string  = key;
		//console.log(key,value);
		val.push(name);
	}
	if(val.length>0){
		return (
			<>
			<SearchUser toUser={props.toUser} setToUser={props.setToUser}/>
				{ val.map((value:string,index:number) => (
					<>
						<hr/>
						<div className = "ChatName" key = { index } >
							<p onClick={ handleSelectUser }>{value}</p> <br/>
						</div>
						<hr/>
					</>
				))
			}
			</>
		);
	}else{
		return(
			<div/>
		)
	}
};
export {AllChats};