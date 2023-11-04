import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../contexts/UserContextProvider";
import { useEffect } from "react";
import axiosClient from "../axios-client";

export default function MainLayout() {

   const {token, user, setUser, setToken, notification, setNotification} = useUserContext();
    
    // if(!token){
    //   return <Navigate to="/login" />
    // }

    const handleLogout = (ev) => {
      ev.preventDefault();
        axiosClient.post('logout')
        .then(()=>{
          setUser({});
          setToken(null);
        })
    }

    useEffect(()=>{
      axiosClient.get('user')
      .then(({data})=>{
        setUser(data);
      })
    },[])

  return (
    <div className="container">

      <div className="nav">
        <div className="title">
          <span>Цуравий селеп U</span>
        </div>
        <div className="links">
          <NavLink to="#">Link</NavLink>
          <NavLink to="#">Link</NavLink>
          <NavLink to="users">Users</NavLink>
          <NavLink onClick={handleLogout}>User: {user.name}</NavLink>
        </div>
      </div>

        { notification && <span>Mesage: { notification }</span> }
      
      <div className="content">
        <Outlet />
      </div>

    </div>
  );
}
