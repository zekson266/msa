import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../contexts/UserContextProvider";
import { useState, Link } from "react";
import LoginForm from "./auth/Login";
import axiosClient from "../axios-client";

export default function MainLayout() {

   const {token, user, setUser, setToken, notification, setNotification} = useUserContext();
    
    if(token){
      return <Navigate to="/" />
    }

    const handleLogout = (ev) => {
      ev.preventDefault();
        axiosClient.post('logout')
        .then(()=>{
          setUser({});
          setToken(null);
        })
    }

  return (
    <div className="container">

      <div className="nav">
        <div className="title">
          <span>Цуравий селеп G</span>
        </div>
        <div className="links">
          <NavLink to="#">Link</NavLink>
          <NavLink to="#">Link</NavLink>
          <NavLink to="signup">Signup</NavLink>
          <NavLink to="login">Login</NavLink>
        </div>
      </div>

      <div>
        <Outlet />
      </div>

    </div>
  );
}
