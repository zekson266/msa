import { useRef, useState } from "react";
import axiosClient from "../../axios-client";
import { useUserContext } from "../../contexts/UserContextProvider";
import { Link } from "react-router-dom";

export default function Signup() {

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [errors,setErrors] = useState();

  const {setUser, setToken, setNotification} = useUserContext();

  const onSubmit = (ev) => {
      ev.preventDefault();
      const payLoad = {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        password_confirmation: passwordConfirmationRef.current.value,
      }

      axiosClient.post('signup',payLoad)
      .then(({data})=>{
        setUser(data.user);
        setToken(data.token);
      })
      .catch(err=>{
        const response = err.response;
        if(response && response.status === 422){
          setErrors(response.data.errors);
          
        }
        setErrors(response.data.errors);
          
      })
  }

  return (
    <div className="content">
      <form onSubmit={onSubmit} className="login-form">
        { errors &&
          <div class="alert alert-danger d-flex align-items-start flex-column" role="alert">
          {
            Object.keys(errors).map(key=>(
            <span key={key}>{errors[key][0]}</span>
          ))
          }
          </div>
        }
        <h2 className="text-center">Signup</h2>
        <div className="mb-3">
          <label className="form-label">Name: </label>
          <input ref={nameRef} type="text" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Email: </label>
          <input ref={emailRef} type="email" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label ">Password: </label>
          <input ref={passwordRef} type="password" className="form-control"/>
        </div>
        <div className="mb-3">
          <label className="form-label ">Password confirmation: </label>
          <input ref={passwordConfirmationRef} type="password" className="form-control"/>
        </div>
        <div className="mb-3 text-center">
          Alredy have an account? Please <Link to="/login">login</Link>.
        </div>
        <div>
          <button type="submit" className="btn btn-outline-primary btn-sm form-control">Signup</button>
        </div>
      </form>
    </div>
  );
}
  