import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';
import NavBar from './components/NavBar';
import LandingPage from './components/LandingPage';
import './styles/App.css';
import { ChatBar } from './components/ChatBar';
import { DisplayChat } from './components/DisplayChat';
import { Route,Routes } from 'react-router-dom';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { AllChats } from './components/AllChats';
function App() {
  const [value, setValue]: [string, Dispatch<SetStateAction<string>>] = useState("");
  const [displayVal, setDisplayVal]:any = useState([]);
  const [loginInfo, setLoginInfo] = useState({});
  const [validated, setValidation ] = useState(false);
  const [token, setToken]:[string, Dispatch<SetStateAction<string>>] = useState("");
  const [user, setUser]:[any,any] = useState(null);
  const [allChat, setAllChat]  = useState({});
  const [toUser, setToUser]:[any, any] = useState(null);
  const [emailMap , setEmailMap] = useState({});
  useEffect(()=>{
    let getUser = ()=>{
      console.log("RAN");
        fetch("http://localhost:4000/validateUser/",{
          credentials:"include" // to send the httpOnly cookie to the server ; on the server end make sure Allow-credentials are true
        }).then((d)=>{
          return d.json();
        })
        .then((d:any)=>{
          console.log(d);
          if(d.user === undefined || d === null){
            setToken("");
          }else{
            setUser(d.user);
            const currentUser = d.user;
            fetch("http://localhost:8000/findUser/",{
              method: "POST",
              body: JSON.stringify({id:JSON.parse(d.user).id, email: JSON.parse(d.user).email}),
              credentials: "include",
              headers:{
                'content-type': 'application/json;charset=utf-8',
              }
            }).then((d)=>{
              return d.json();
            })
            .then((d:any)=>{
              let len  = d.length;
              console.log("Data from mongo", d);
              const emailMaps:any = {};
              const chatData:any = {}
              let tempDisplayChat = []
              for(let i = 0;i<len;i++){
                emailMaps[d[i].tousername] = d[i].receiverId;// touser hashmap
                emailMaps[d[i].fromusername] = d[i].email; // fromuser hashmap
                let f: boolean = false;
                if(d[i].username === JSON.parse(currentUser).username){
                  f= true;
                }
                if(!f && chatData[d[i].tousername] === undefined){
                    if(JSON.parse(currentUser).email === d[i].receiverId){
                        chatData[d[i].fromusername] = [];
                    }else{
                        chatData[d[i].tousername] = [];
                    }
                }
                if(!f){
                  if(JSON.parse(currentUser).email === d[i].receiverId){ // is currentUser is in the receiver end make the sender important
                    chatData[d[i].fromusername].push({message: d[i].message,email: d[i].receiverId, fromemail : d[i].email});
                  }else{
                    chatData[d[i].tousername].push({message: d[i].message,email: d[i].receiverId, fromemail:d[i].email});
                  }
                }
                tempDisplayChat.push( {message: d[i].message,email: d[i].receiverId,fromemail:d[i].email});
                
              }
              //console.log(tempDisplayChat);
              setDisplayVal(tempDisplayChat);
              setEmailMap(emailMaps);
              //console.log("Dsi", displayVal);
              //console.log(chatData);
              setAllChat(chatData);
            })
            .catch(ex=>{
              console.error(ex);
            });
          }
        })
        .catch((ex)=>{
          setToken("");
        });
    }
    if(user===null){
      getUser();
    }
    
    console.log("From useEffect ", displayVal, allChat, emailMap);
  },[toUser]);
  // var checkToken:()=>void =  async ()=>{
  //   if(token === "") return false;
  //   var data = await fetch("http://localhost:4000/protected",{
  //     method:"GET",
  //     headers:{
  //       authorization : "Bearer-" + token,
  //       content-type: 'application/json;charset=utf-8'
  //     }
  // //   });     
  //   if(data.status === 200 || data.status === 201) setValidation(true);
  //   else setValidation(false);  
  // }
  // }
   
    return (
      <Routes>
      <Route path="/"  element = {<div className="App"><NavBar user={user} /> <LandingPage user = {user} validated = {validated}/></div>} /> 
      <Route path="/easdasdasdasifnjsnfjkadsnkjasbdajskdbhasdhasdasd"  element={
        <div className="App">
          <NavBar user={user}/>
          <div className="chatComponent">
            <DisplayChat setToUser = {setToUser} user={user} toUserName = "PRJ BH" toUser = {toUser} valueList ={displayVal} />
            <ChatBar  token = {token} validated = {validated} value={value} setValue={setValue} displayVal={displayVal} 
                setDisplayVal={setDisplayVal} user = {user}
                toUser = {toUser}
                setToUser = {setToUser}/>
          </div>
      </div>
      } />
      <Route path="/signIn" element={<><NavBar user={user}/><SignIn loginInfo = {loginInfo} setLoginInfo = {setLoginInfo}
        setToken = {setToken} setUser ={setUser} /></>}/>
        <Route path = "/signUp" element = {<><NavBar user={user}/><SignUp/></>}/>
        <Route path="/chats" element = { <> <NavBar user={user}/> <AllChats emailMap = {emailMap} user ={user} allChat = { allChat } toUser = { toUser } setToUser = {setToUser}/></>}/>

     </Routes>
    );
}

export default App;
