import { useRef } from "react";
import axiosClient from "../../axios-client";
import { useUserContext } from "../../contexts/UserContextProvider";

export default function Signup() {

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();

  const {setUser, setToken } = useUserContext();

  const onSubmit = (ev) => {
      ev.preventDefault();
      const payLoad = {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        password_confirmation: passwordConfirmationRef.current.value,
      }

      console.log(payLoad);
      axiosClient.post('signup',payLoad)
      .then(({data})=>{
        setUser(data.toke);
        setToken(data.token);
      })
      .catch(err=>{
        const response = err.response;
        if(response & response.status === 422){
          console.log(response.data.errors);
        }
      })
  }

    return (
      <div className="d-flex justify-content-center align-items-center">
        <form className="border p-4 rounded" onSubmit={onSubmit}>
          <h3 className="text-center">Sign Up</h3>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input ref={nameRef} type="text" className="form-control" id="name" />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input ref={emailRef} type="email" className="form-control" id="email" />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input ref={passwordRef} type="password" className="form-control" id="password" />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password confirmation
            </label>
            <input ref={passwordConfirmationRef} type="password" className="form-control" id="password_confirmation" />
          </div>
          <button type="submit" className="btn btn-outline-primary w-100">
            Sign Up
          </button>
        </form>
      </div>
    );
  }
  