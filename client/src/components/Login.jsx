import React,{useState,useRef} from 'react';
import {Room,Cancel} from "@material-ui/icons";
import "./login.css";
import axios from "axios";

export default function Login({setLogin,myStorage,setCurrentUser}){

  const [fail,setFail]= useState(false);
  const nameRef = useRef();

  const passwordRef= useRef();

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value
    };

    try {
      const res = await axios.post("/api/users/login", user);
      myStorage.setItem("user", res.data.username);
      setFail(false);
      setCurrentUser(res.data.username);
      setLogin(false);
    } catch (e) {
      setFail(true);
    }
  }

  return(
    <div className="loginContainer">
     <div className="logo">
      <Room />
       Trip Feed
     </div>
     <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" ref={nameRef} className="txtfield" required autocomplete="off" />

      <input type="password" placeholder="Password" ref={passwordRef} className="txtfield" required />
      <button className="loginBtn"> Login </button>

      {fail && <span className="failure">Error! Wrong Username or Password</span>}
     </form>
     <Cancel className="loginCancel" onClick={() => setLogin(false)}/>
    </div>
  );
}
