import { useRef, useState } from "react";
import { useUserContext } from "../../contexts/UserContextProvider";
import axiosClient from "../../axios-client";

export default function Login() {

  const {setUser, setToken} = useUserContext();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errors,setErrors] = useState();

  const onSubmit = (ev) => {
    ev.preventDefault();
    const payLoad = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    console.log(payLoad);
    axiosClient.post('login',payLoad)
    .then(({data})=>{
      setUser(data.user);
      setToken(data.token);
    })
    .catch(err => {
      const response = err.response;
      if(response && response.status === 422){
        setErrors(response.data.errors);
      }
      setErrors(response.data.errors);
    })
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <form onSubmit={onSubmit} className="col-6 text-align-center">
        { errors &&
          <div class="alert alert-danger d-flex align-items-start flex-column" role="alert">
          {
            Object.keys(errors).map(key=>(
            <span key={key}>{errors[key][0]}</span>
          ))
          }
          </div>
        }
        <h2 className="text-center">Login</h2>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email: </label>
          <input ref={emailRef} type="email" className="form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label ">Password: </label>
          <input ref={passwordRef} type="password" className="form-control"/>
        </div>
        <div>
          <button type="submit" className="btn btn-outline-primary btn-sm">Login</button>
        </div>
      </form>
    </div>
  );
}
  