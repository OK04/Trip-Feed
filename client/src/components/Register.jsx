import React,{useState,useRef} from 'react';
import {Room,Cancel} from "@material-ui/icons";
import "./register.css";
import axios from "axios";

export default function Register({setRegister}){
  const [success,setSuccess] = useState(false);
  const [fail,setFail]= useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef= useRef();

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value
    };

    try {
      await axios.post("/api/users/register", newUser);
      setFail(false);
      setSuccess(true);
    } catch (e) {
      setFail(true);
    }
  }

  return(
    <div className="registerContainer">
    <div className="logo">
     <Room />
      Trip Feed
    </div>
     <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" ref={nameRef} className="txtfield" required autocomplete="off" />
      <input type="email" placeholder="Email" ref={emailRef} className="txtfield" required autocomplete="off" />
      <input type="password" placeholder="Password" ref={passwordRef} className="txtfield" required />
      <button className="registerBtn"> Register </button>
      {success && (  <span className="success">Successfull. You can login Now!</span> )}
      {fail && <span className="failure">Error!</span>}
     </form>
     <Cancel className="registerCancel" onClick={() => setRegister(false)}/>
    </div>
  );
}
